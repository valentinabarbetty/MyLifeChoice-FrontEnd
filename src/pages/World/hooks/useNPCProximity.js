import { useEffect, useState } from "react";

export function useNPCProximity(playerPos, npcPositions) {
  const [nearNPC, setNearNPC] = useState(null);

  useEffect(() => {
    let closest = null;
    let minDist = Infinity;

    Object.entries(npcPositions).forEach(([id, pos]) => {
      const dx = playerPos.x - pos.x;
      const dz = playerPos.z - pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 2.2 && dist < minDist) {
        minDist = dist;
        closest = id;
      }
    });

    setNearNPC(closest);
  }, [playerPos, npcPositions]);

  return nearNPC;
}
