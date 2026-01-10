import { useState } from "react";
import { CAREER_SCENES } from "./data/careerScenes";
import WorldHUD from "./WorldHUD";
import WorldCanvas from "./WorldCanvas";
import Village from "./environments/Village";
import NPCCharacter from "./characters/NPC";
import Player from "./characters/Player";
import FollowCamera from "./camera/FollowCamera";
import { OrbitControls } from "@react-three/drei";
import Guide from "./characters/Guide";
import IntroCamera from "./camera/IntroCamera";
import CameraManager from "./camera/FollowCamera";

export default function World() {
  const guideId = Number(localStorage.getItem("guideId"));
  const career = localStorage.getItem("career") || "administracion";
  const sceneConfig = CAREER_SCENES[career];
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const currentDialogue = sceneConfig.dialogues[dialogueIndex];
  const [activeNPC, setActiveNPC] = useState(null);

  const isFirstTime = !localStorage.getItem("intro_done");
  const [mode, setMode] = useState(isFirstTime ? "intro" : "explore");
  const guidePosition = [0, -3, -7];
  const introCenter = [0, -3.5, -4]; // punto medio del diálogo

  const introPlayerPos = [-0.9, -3, -8];
  const introGuidePos = [0.8, -3, -8];
  const [playerPos, setPlayerPos] = useState({
    x: introPlayerPos[0],
    y: introPlayerPos[1],
    z: introPlayerPos[2],
  });

  const introDialogues = [
    { speaker: "Guía", text: "Bienvenida a MyLifeChoice." },
    { speaker: "Guía", text: "Aquí encontrarás 13 carreras universitarias." },
    {
      speaker: "Guía",
      text: "Habla con cada personaje para descubrir qué hacen.",
    },
    { speaker: "Guía", text: "Puedes comenzar cuando quieras. ¡Explora!" },
  ];

  return (
    <>
      <WorldCanvas>
        <Village />

        {/* <NPCCharacter
          position={[2, -1.4, 1]}
          onInteract={() => {
            setActiveNPC("administracion");
            setMode("interact");
          }}
        /> */}
        <Player
          mode={mode}
          spawnPosition={introPlayerPos}
          lookAt={mode === "intro" ? introGuidePos : null}
          onMove={(pos) => setPlayerPos({ x: pos.x, y: pos.y, z: pos.z })}
        />

        <Guide
          position={mode === "intro" ? introGuidePos : guidePosition}
          lookAt={mode === "intro" ? introPlayerPos : null}
          onInteract={() => {
            setActiveNPC("guide");
            setMode("guide");
          }}
        />
        <CameraManager
          mode={mode}
          playerPos={playerPos}
          guidePos={mode === "intro" ? introGuidePos : guidePosition}
          npcPos={
            activeNPC === "administracion" ? { x: 2, y: -1.4, z: 1 } : null
          }
          introCenter={introCenter}
        />

        {/* <FollowCamera target={playerPos} /> */}
      </WorldCanvas>
      <WorldHUD
        mode={mode}
        dialogue={
          mode === "intro" ? introDialogues[dialogueIndex] : currentDialogue
        }
        onNext={() => {
          if (mode === "intro") {
            if (dialogueIndex === introDialogues.length - 1) {
              localStorage.setItem("intro_done", "true");
              setDialogueIndex(0);
              setMode("explore");
            } else {
              setDialogueIndex((i) => i + 1);
            }
          } else {
            setDialogueIndex((i) => i + 1);
          }
        }}
        onAccept={() => setMode("dialogue")}
        onReject={() => setMode("explore")}
      />
    </>
  );
}
