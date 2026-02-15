import Village from "./../environments/Village";
import Player from "./../characters/Player";
import Guide from "./../characters/Guide";
import CameraManager from "./../camera/FollowCamera";
import NPCGroup from "./NPCGroup";

export default function WorldScene({
  worldNPCs,
  mode,
  playerPos,
  setPlayerPos,
  nearNPC,
  setNpcPositions,
  setActiveNPC,
  setMode,
}) {
  return (
    <>
      <Village />

      <NPCGroup
        npcs={worldNPCs}
        playerPos={playerPos}
        nearNPC={nearNPC}
        setNpcPositions={setNpcPositions}
        onInteractNPC={(id) => {
          setActiveNPC(id);
          setMode("interact");
        }}
      />

      <Player
        mode={mode}
        spawnPosition={[-0.9, -3, -8]}
        onMove={(pos) => setPlayerPos(pos)}
      />

      <Guide
        position={[0, -3, -7]}
        onInteract={() => {
          setActiveNPC("guide");
          setMode("guide");
        }}
      />

      <CameraManager mode={mode} playerPos={playerPos} />
    </>
  );
}
