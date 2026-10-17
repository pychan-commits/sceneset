import { useEffect, useState } from "react";
import { defaultData, type SceneSetData } from "./demoData";

const STORAGE_KEY = "sceneset-demo-v1";

function readData(): SceneSetData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as SceneSetData;
  } catch {
    // Fall back to the deterministic demo when storage is unavailable.
  }
  return defaultData;
}

export function useSceneSetData() {
  const [data, setData] = useState<SceneSetData>(readData);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // The workspace remains usable in restricted preview contexts.
    }
  }, [data]);

  const update = (next: SceneSetData | ((current: SceneSetData) => SceneSetData)) => {
    setData(current => typeof next === "function" ? next(current) : next);
  };

  const resetDemo = () => setData(defaultData);

  return { data, update, resetDemo };
}
