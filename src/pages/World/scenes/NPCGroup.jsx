import { A11y } from "@react-three/a11y";
import NPC from "../characters/NPC";
import { useRef, useMemo } from "react";
import { NPCS } from "../../World/data/npcsInfo"

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

  return npcsList.map((npc) => {
    const npcInfo = NPCS[npc.id];

    return (
      <A11y
        key={npc.id}
        role="button"
        description={`${
          npcInfo?.name || npc.id
        }, ${
          npcInfo?.career_name || npc.id
        }. Presiona Enter para conocer esta carrera`}
        actionCall={() => onInteractNPC(npc.id)}
        disabled={nearNPC !== npc.id}
      >
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
      </A11y>
    );
  });
}