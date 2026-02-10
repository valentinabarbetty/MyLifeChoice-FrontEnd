import { useState } from "react";
import { useWorldState } from "./hooks/useWorldState";
import { useNPCProximity } from "./hooks/useNPCProximity";
import WorldCanvas from "./WorldCanvas";
import WorldScene from "./scenes/WorldScene";
import WorldHUD from "../World/ui/WorldHUD";
import AdministracionScene from "./scenes/careers/AdministracionScene";
import { CAREER_SCENES } from "./data/careerScenes";
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
  const currentDialogue =
    scene === "CAREER" && activeCareer
      ? CAREER_SCENES[activeCareer]?.dialogues?.manager?.[dialogueIndex]
      : null;

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

        {scene === "CAREER" && (
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
        scene={scene}
        mode={mode}
        dialogue={currentDialogue}
        onNext={() => {
          const dialogues = CAREER_SCENES[activeCareer]?.dialogues?.manager;
          if (!dialogues) return;

          if (dialogueIndex + 1 < dialogues.length) {
            setDialogueIndex((i) => i + 1);
          } else {
            setDialogueIndex(0);
            setMode("career-feedback"); 
          }
        }}
        onAccept={() => {
        
          if (mode === "interact") {
            setScene("CAREER");
            setActiveCareer("administracion");
            setDialogueIndex(0);
            setMode("dialogue");
            return;
          }

          if (mode === "career-feedback") {
            setScene("WORLD");
            setActiveCareer(null);
            setActiveNPC(null);
            setDialogueIndex(0);
            setMode("explore"); 
          }
        }}
        onReject={() => {
        
          if (mode === "interact") {
            setActiveNPC(null);
            setMode("explore");
            return;
          }

          if (mode === "career-feedback") {
            setScene("WORLD");
            setActiveCareer(null);
            setActiveNPC(null);
            setDialogueIndex(0);
            setMode("explore"); 
          }
        }}
      />
    </>
  );
}
