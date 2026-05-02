import NPC from "../characters/NPC";
import { useRef, useMemo } from "react";

export default function NPCGroup({
  npcs,
  playerPos,
  nearNPC,
  setNpcPositions,
  onInteractNPC,
}) {
  const npcRefs = useRef({});
  const npcsList = useMemo(() => Object.values(npcs), [npcs]);
  
  const handleMove = (id, pos) => {
    const lastPos = npcRefs.current[id];
    if (!lastPos || lastPos.distanceTo(pos) > 0.5) {
      npcRefs.current[id] = pos.clone();
      setNpcPositions((prev) => ({ ...prev, [id]: pos }));
    }
  };
  
  return npcsList.map((npc) => (
    <NPC
      key={npc.id}
      modelPath={npc.model}
      route={npc.route}
      lookAt={playerPos}
      isNear={nearNPC === npc.id}
      animationState={nearNPC === npc.id ? "idle" : "walk"}
      onMove={(pos) => handleMove(npc.id, pos)}
      onInteract={() => onInteractNPC(npc.id)}
    />
  ));
}