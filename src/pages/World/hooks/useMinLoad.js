
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

export function useMinLoad(minMs = 6000) {
  const { active, progress } = useProgress();
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimeUp(true), minMs);
    return () => clearTimeout(t);
  }, [minMs]);

  const assetsReady = !active && progress === 100;
  return timeUp && assetsReady;
}