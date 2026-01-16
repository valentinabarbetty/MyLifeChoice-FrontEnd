import NPC from "../characters/NPC";

export default function NPCGroup({
  npcs,
  playerPos,
  nearNPC,
  setNpcPositions,
  onInteractNPC,
}) {
  return Object.values(npcs).map((npc) => (
    <NPC
      key={npc.id}
      modelPath={npc.model}
      route={npc.route}
      lookAt={playerPos}
      isNear={nearNPC === npc.id}
      animationState={nearNPC === npc.id ? "idle" : "walk"}
      onMove={(pos) =>
        setNpcPositions((prev) => ({ ...prev, [npc.id]: pos }))
      }
      onInteract={() => onInteractNPC(npc.id)}
    />
  ));
}
