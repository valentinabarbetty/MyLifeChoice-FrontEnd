import { useState } from "react";
import { useWorldState } from "./hooks/useWorldState";
import { useNPCProximity } from "./hooks/useNPCProximity";
import WorldCanvas from "./WorldCanvas";
import WorldScene from "./scenes/WorldScene";
import WorldHUD from "../World/ui/WorldHUD";
import AdministracionScene from "./scenes/careers/AdministracionScene";
export default function World() {
  const {
    sceneConfig,
    mode,
    setMode,
    dialogueIndex,
    setDialogueIndex,
    activeNPC,
    setActiveNPC,
    scene,
    setScene,
    activeCareer,
    setActiveCareer,
  } = useWorldState();

  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0, z: 0 });
  const [npcPositions, setNpcPositions] = useState({});

  const nearNPC = useNPCProximity(playerPos, npcPositions);

  return (
    <>
      <WorldCanvas>
        {scene === "WORLD" && (
          <WorldScene
            sceneConfig={sceneConfig}
            mode={mode}
            playerPos={playerPos}
            setPlayerPos={setPlayerPos}
            nearNPC={nearNPC}
            setNpcPositions={setNpcPositions}
            setActiveNPC={setActiveNPC}
            setMode={setMode}
          />
        )}

        {scene === "CAREER" && activeCareer === "administracion" && (
          <AdministracionScene
            onExit={() => {
              setScene("WORLD");
              setActiveCareer(null);
              setMode("explore");
            }}
          />
        )}
      </WorldCanvas>

      <WorldHUD
        mode={mode}
        activeNPC={activeNPC}
        dialogueIndex={dialogueIndex}
        setDialogueIndex={setDialogueIndex}
        sceneConfig={sceneConfig}
        // 🔥 AQUÍ
        onAccept={() => {
          setScene("CAREER");
          setActiveCareer("administracion"); // luego será dinámico
          setMode("dialogue");
        }}
        onReject={() => {
          setActiveNPC(null);
          setMode("explore");
        }}
      />
    </>
  );
}
