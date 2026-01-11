import { useEffect, useState } from "react";
import { CAREER_SCENES } from "./data/careerScenes";
import WorldHUD from "./WorldHUD";
import WorldCanvas from "./WorldCanvas";
import Village from "./environments/Village";
import Player from "./characters/Player";
import FollowCamera from "./camera/FollowCamera";
import { OrbitControls } from "@react-three/drei";
import Guide from "./characters/Guide";
import IntroCamera from "./camera/IntroCamera";
import CameraManager from "./camera/FollowCamera";
import {
  ADMIN_NPCS,
  ADMIN_DIALOGUE,
} from "../../../src/data/dialogues/adminstracion";
import NPC from "./characters/NPC";

export default function World() {
  const guideId = Number(localStorage.getItem("guideId"));
  const career = localStorage.getItem("career") || "administracion";
  const sceneConfig = CAREER_SCENES[career];
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const currentDialogue = sceneConfig.dialogues[dialogueIndex];
  const [activeNPC, setActiveNPC] = useState(null);
  const [nearNPC, setNearNPC] = useState(null);
  const [npcPositions, setNpcPositions] = useState({});

  const isFirstTime = !localStorage.getItem("intro_done");
  const [mode, setMode] = useState(isFirstTime ? "intro" : "explore");
  const guidePosition = [0, -3, -7];
  const introCenter = [0, -3.5, -4];
  const introPlayerPos = [-0.9, -3, -8];
  const introGuidePos = [0.8, -3, -8];
  const [playerPos, setPlayerPos] = useState({
    x: introPlayerPos[0],
    y: introPlayerPos[1],
    z: introPlayerPos[2],
  });
  const [npcState, setNpcState] = useState({
    animation: "idle",
    dialogueIndex: 0,
  });
  const currentNPCDialogue =
    activeNPC === "manager" ? ADMIN_DIALOGUE[npcState.dialogueIndex] : null;
  const introDialogues = [
    { speaker: "Guía", text: "Bienvenida a MyLifeChoice." },
    { speaker: "Guía", text: "Aquí encontrarás 13 carreras universitarias." },
    {
      speaker: "Guía",
      text: "Habla con cada personaje para descubrir qué hacen.",
    },
    { speaker: "Guía", text: "Puedes comenzar cuando quieras. ¡Explora!" },
  ];
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

  return (
    <>
      <WorldCanvas>
        <Village />

        {Object.values(ADMIN_NPCS).map((npc) => (
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
            onInteract={() => {
              setActiveNPC(npc.id);
              setMode("interact");
            }}
          />
        ))}

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
          activeNPC === "manager"
            ? currentNPCDialogue
            : mode === "intro"
            ? introDialogues[dialogueIndex]
            : currentDialogue
        }
        onNext={() => {
          if (activeNPC === "manager") {
            const nextIndex = npcState.dialogueIndex + 1;

            if (nextIndex >= ADMIN_DIALOGUE.length) {
              setNpcState({ animation: "idle", dialogueIndex: 0 });
              setActiveNPC(null);
              setMode("explore");
            } else {
              setNpcState({
                animation: ADMIN_DIALOGUE[nextIndex].animation,
                dialogueIndex: nextIndex,
              });
            }
            return;
          }

          // Intro u otros diálogos
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
        onAccept={() => {
          if (activeNPC === "manager") {
            setMode("dialogue");
            setNpcState({ animation: "talking", dialogueIndex: 0 });
          }
        }}
        onReject={() => {
          setActiveNPC(null);
          setMode("explore");
        }}
      />
    </>
  );
}
