import { useEffect, useRef, useState } from "react";
import { defaultData, type Activity, type SceneSetData } from "./demoData";

const STORAGE_KEY = "sceneset-demo-v1";
const ACTIVITY_LIMIT = 50;
const ACTIVITY_CHANNEL = "sceneset-activity-v1";
const CURRENT_ACTOR = { actor: "Maya Chen", initials: "MC", color: "#f25c54" };

type ActivityChange = Pick<Activity, "action" | "subject">;
type SharedMessage = { source: string; data: SceneSetData };

function limitActivities(items: Activity[]) {
  const unique = new Map<string, Activity>();
  for (const item of items) unique.set(item.id, item);
  return [...unique.values()]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, ACTIVITY_LIMIT);
}

function normalizeData(data: SceneSetData): SceneSetData {
  return { ...data, activity: limitActivities(data.activity || []) };
}

function readData(): SceneSetData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<SceneSetData>;
      const migratedEvent = parsed.event?.name === "Afterglow / Community Night" && !parsed.events?.length
        ? { ...parsed.event, name: "Midnight Garden Gala" }
        : parsed.event;
      return normalizeData({ ...defaultData, ...parsed, event: migratedEvent || defaultData.event, files: parsed.files || defaultData.files } as SceneSetData);
    }
  } catch {
    // Fall back to the deterministic demo when storage is unavailable.
  }
  return normalizeData(defaultData);
}

function changed<T>(before: T, after: T) {
  return JSON.stringify(before) !== JSON.stringify(after);
}

function makeActivity(change: ActivityChange, index: number): Activity {
  const randomId = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
  return {
    id: `a-live-${Date.now()}-${index}-${randomId}`,
    ...CURRENT_ACTOR,
    ...change,
    time: "Just now",
    createdAt: Date.now(),
  };
}

function diffCollection<T extends { id: string }>(
  before: T[],
  after: T[],
  subject: (item: T) => string,
  action = "updated",
): ActivityChange | null {
  const added = after.find(item => !before.some(previous => previous.id === item.id));
  if (added) return { action: "added", subject: subject(added) };

  const removed = before.find(item => !after.some(next => next.id === item.id));
  if (removed) return { action: "removed", subject: subject(removed) };

  const updated = after.find(item => {
    const previous = before.find(candidate => candidate.id === item.id);
    return previous && changed(previous, item);
  });
  return updated ? { action, subject: subject(updated) } : null;
}

function buildActivityChanges(previous: SceneSetData, next: SceneSetData): ActivityChange[] {
  const changes: ActivityChange[] = [];
  const taskChange = next.tasks.find(task => !previous.tasks.some(item => item.id === task.id));
  if (taskChange) {
    changes.push({ action: "added", subject: taskChange.title });
  } else {
    const completedTask = next.tasks.find(task => {
      const before = previous.tasks.find(item => item.id === task.id);
      return before && before.status !== "done" && task.status === "done";
    });
    const movedTask = next.tasks.find(task => {
      const before = previous.tasks.find(item => item.id === task.id);
      return before && before.status !== task.status;
    });
    if (completedTask) changes.push({ action: "completed", subject: completedTask.title });
    else if (movedTask) changes.push({ action: "moved", subject: `${movedTask.title} → ${movedTask.status}` });
    else {
      const genericTaskChange = diffCollection(previous.tasks, next.tasks, task => task.title);
      if (genericTaskChange) changes.push(genericTaskChange);
    }
  }

  if (changed({ event: previous.event, events: previous.events || [] }, { event: next.event, events: next.events || [] })) {
    changes.push({ action: "updated", subject: next.event.name });
  }

  const budgetChange = diffCollection(previous.budget, next.budget, item => item.name);
  if (budgetChange) changes.push(budgetChange);

  const supplierChange = diffCollection(previous.suppliers, next.suppliers, item => item.name);
  if (supplierChange) changes.push(supplierChange);

  const guestChange = diffCollection(previous.guests, next.guests, item => item.name);
  if (guestChange) changes.push(guestChange);

  const scheduleChange = diffCollection(previous.schedule, next.schedule, item => item.title, "updated");
  if (scheduleChange) {
    const completedMoment = next.schedule.find(item => {
      const before = previous.schedule.find(candidate => candidate.id === item.id);
      return before && !before.complete && item.complete;
    });
    changes.push(completedMoment ? { action: "completed", subject: completedMoment.title } : scheduleChange);
  }

  if (changed(previous.layout, next.layout)) {
    const layoutChange = diffCollection(previous.layout, next.layout, item => item.label, "moved");
    if (layoutChange) changes.push(layoutChange);
  }
  if (previous.layoutLocked !== next.layoutLocked) {
    changes.push({ action: next.layoutLocked ? "locked" : "unlocked", subject: "Venue layout" });
  }

  const noteChange = diffCollection(previous.notes, next.notes, item => item.title);
  if (noteChange) {
    const updatedNote = next.notes.find(item => previous.notes.some(before => before.id === item.id));
    if (!updatedNote) {
      changes.push(noteChange);
    } else {
      const previousNote = previous.notes.find(item => item.id === updatedNote.id);
      const mention = previousNote && updatedNote.body !== previousNote.body
        ? updatedNote.body.match(/@[A-Za-z][A-Za-z .'-]*/)?.[0]?.trim()
        : null;
      const pinned = previousNote && !previousNote.pinned && updatedNote.pinned;
      changes.push(pinned
        ? { action: "pinned", subject: updatedNote.title }
        : mention
          ? { action: "mentioned", subject: `${mention.slice(1)} in ${updatedNote.title}` }
          : noteChange);
    }
  }

  return changes;
}

function withLiveActivity(previous: SceneSetData, next: SceneSetData): SceneSetData {
  const changes = buildActivityChanges(previous, next);
  if (!changes.length) return normalizeData(next);
  const liveEntries = changes.map(makeActivity);
  return normalizeData({ ...next, activity: [...liveEntries, ...next.activity] });
}

export function useSceneSetData() {
  const [data, setData] = useState<SceneSetData>(readData);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const tabIdRef = useRef(`tab-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const remoteUpdateRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyRemoteData = (incoming: SceneSetData) => {
      remoteUpdateRef.current = true;
      setData(normalizeData(incoming));
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        applyRemoteData(JSON.parse(event.newValue) as SceneSetData);
      } catch {
        // Ignore malformed cross-tab payloads and keep the current workspace usable.
      }
    };

    window.addEventListener("storage", handleStorage);
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(ACTIVITY_CHANNEL);
      channelRef.current = channel;
      channel.onmessage = (event: MessageEvent<SharedMessage>) => {
        if (event.data?.source !== tabIdRef.current && event.data?.data) applyRemoteData(event.data.data);
      };
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
      channelRef.current?.close();
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // The workspace remains usable in restricted preview contexts.
    }

    if (remoteUpdateRef.current) {
      remoteUpdateRef.current = false;
      return;
    }
    channelRef.current?.postMessage({ source: tabIdRef.current, data } satisfies SharedMessage);
  }, [data]);

  const update = (next: SceneSetData | ((current: SceneSetData) => SceneSetData)) => {
    setData(current => {
      const nextData = typeof next === "function" ? next(current) : next;
      return withLiveActivity(current, nextData);
    });
  };

  const resetDemo = () => setData(normalizeData(defaultData));

  return { data, update, resetDemo };
}
