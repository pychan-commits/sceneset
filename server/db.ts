import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, events, users, workspaceMembers, workspaces } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available");
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listWorkspacesForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({ workspace: workspaces, role: workspaceMembers.role })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
    .where(eq(workspaceMembers.userId, userId));
}

export async function listEventsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({ event: events, workspaceRole: workspaceMembers.role })
    .from(events)
    .innerJoin(workspaceMembers, eq(events.workspaceId, workspaceMembers.workspaceId))
    .where(eq(workspaceMembers.userId, userId));
}

export async function createWorkspaceForUser(userId: number, name: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const inserted = await db.insert(workspaces).values({ ownerId: userId, name });
  const workspaceId = Number(inserted[0].insertId);
  await db.insert(workspaceMembers).values({ workspaceId, userId, role: "owner" });
  return workspaceId;
}

export async function createEventForUser(userId: number, input: {
  workspaceId: number;
  name: string;
  eventDate: Date;
  venue?: string;
  city?: string;
  goal?: string;
  attendeeTarget?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const membership = await db
    .select({ id: workspaceMembers.id })
    .from(workspaceMembers)
    .where(and(eq(workspaceMembers.workspaceId, input.workspaceId), eq(workspaceMembers.userId, userId)))
    .limit(1);
  if (!membership.length) throw new Error("Workspace access denied");

  const inserted = await db.insert(events).values({
    workspaceId: input.workspaceId,
    name: input.name,
    eventDate: input.eventDate,
    venue: input.venue,
    city: input.city,
    goal: input.goal,
    attendeeTarget: input.attendeeTarget ?? 0,
  });
  return Number(inserted[0].insertId);
}
