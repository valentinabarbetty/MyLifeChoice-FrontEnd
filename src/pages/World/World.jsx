import { useState } from "react";
import { useWorldState } from "./hooks/useWorldState";
import { useNPCProximity } from "./hooks/useNPCProximity";
import WorldCanvas from "./WorldCanvas";
import WorldScene from "./scenes/WorldScene";
import WorldHUD from "./WorldHUD";
export default function World() {
  const {
    sceneConfig,
    mode,
    setMode,
    dialogueIndex,
    setDialogueIndex,
    activeNPC,
    setActiveNPC,
  } = useWorldState();

  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0, z: 0 });
  const [npcPositions, setNpcPositions] = useState({});

  const nearNPC = useNPCProximity(playerPos, npcPositions);

  return (
    <>
      <WorldCanvas>
        <WorldScene
          sceneConfig={sceneConfig} // 👈 AÑADIR
          mode={mode}
          playerPos={playerPos}
          setPlayerPos={setPlayerPos}
          nearNPC={nearNPC}
          setNpcPositions={setNpcPositions}
          setActiveNPC={setActiveNPC}
          setMode={setMode}
        />
      </WorldCanvas>

      <WorldHUD
        mode={mode}
        activeNPC={activeNPC}
        dialogueIndex={dialogueIndex}
        setDialogueIndex={setDialogueIndex}
        setMode={setMode}
        setActiveNPC={setActiveNPC}
        sceneConfig={sceneConfig}
      />
    </>
  );
}
