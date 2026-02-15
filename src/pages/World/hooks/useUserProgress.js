import { useState, useEffect } from "react";

const STORAGE_KEY = "mlc_progress";

const DEFAULT_STATE = {
  visited: []
};

export function useUserProgress() {
  const [progress, setProgress] = useState(DEFAULT_STATE);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  const markVisited = (careerId) => {
    setProgress((prev) => {
      if (prev.visited.includes(careerId)) return prev;

      const updated = {
        ...prev,
        visited: [...prev.visited, careerId]
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    visited: progress.visited,
    markVisited
  };
}
