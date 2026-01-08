import { useState } from "react";
import { CAREER_SCENES } from "./data/careerScenes";
import WorldHUD from "./WorldHUD";
import WorldCanvas from "./WorldCanvas";
import Village from "./environments/Village";
import NPCCharacter from "./characters/NPC";

export default function World() {
  const guideId = Number(localStorage.getItem("guideId"));
  const career = localStorage.getItem("career") || "administracion";
  const sceneConfig = CAREER_SCENES[career];
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const currentDialogue = sceneConfig.dialogues[dialogueIndex];
  const [mode, setMode] = useState("explore"); //modo explorar o carrera
  const [activeNPC, setActiveNPC] = useState(null);
  return (
    <>
      <WorldCanvas>
        <Village />

        <NPCCharacter
          position={[2, -1.4, 1]}
          onInteract={() => {
            setActiveNPC("administracion");
            setMode("interact");
          }}
        />
      </WorldCanvas>
      <WorldHUD
        mode={mode}
        dialogue={currentDialogue}
        onNext={() => setDialogueIndex((i) => i + 1)}
        onAccept={() => setMode("dialogue")}
        onReject={() => setMode("explore")}
      />
    </>
  );
}
