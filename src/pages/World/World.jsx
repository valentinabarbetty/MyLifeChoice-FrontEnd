import { useState } from "react";
import { useWorldState } from "./hooks/useWorldState";
import { useNPCProximity } from "./hooks/useNPCProximity";
import WorldCanvas from "./WorldCanvas";
import WorldScene from "./scenes/WorldScene";
import WorldHUD from "../World/ui/WorldHUD";
import AdministracionScene from "./scenes/careers/administracion/AdministracionScene";
import { useUserProgress } from "./hooks/useUserProgress";
import { CAREER_DIALOGUES } from "./data/careerScenes";

import { ALL_CAREERS } from "./data/careersList";
import CareerRouter from "./scenes/careers/CareerRouter";

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
  const { visited, markVisited } = useUserProgress();

  const availableCareers = ALL_CAREERS.filter((c) => !visited.includes(c));

  const visibleCareers = availableCareers.slice(0, 3);
  const ROUTES = [
    [
      [2, -3, 1],
      [4, -3, 1],
      [4, -3, 3],
      [2, -3, 3],
    ],
    [
      [-4, -3, 2],
      [-2, -3, 2],
      [-2, -3, 4],
      [-4, -3, 4],
    ],
    [
      [0, -3, -2],
      [2, -3, -2],
      [2, -3, 0],
      [0, -3, 0],
    ],
  ];

  const worldNPCs = visibleCareers.reduce((acc, careerId, index) => {
    acc[careerId] = {
      id: careerId,
      model: `/assets/models/npc/${careerId}.glb`,
      route: ROUTES[index] || ROUTES[0],
    };
    return acc;
  }, {});

  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0, z: 0 });
  const [npcPositions, setNpcPositions] = useState({});

  const nearNPC = useNPCProximity(playerPos, npcPositions);
  const currentDialogue =
    scene === "CAREER" && activeCareer
      ? CAREER_DIALOGUES[activeCareer]?.[dialogueIndex]
      : null;

  return (
    <>
      <WorldCanvas>
        {scene === "WORLD" && (
          <WorldScene
            worldNPCs={worldNPCs}
            mode={mode}
            playerPos={playerPos}
            setPlayerPos={setPlayerPos}
            nearNPC={nearNPC}
            setNpcPositions={setNpcPositions}
            setActiveNPC={setActiveNPC}
            setMode={setMode}
          />
        )}
        {scene === "CAREER" && activeCareer && (
          <CareerRouter careerId={activeCareer} />
        )}

        {/* {scene === "CAREER" && (
          <AdministracionScene
            onExit={() => {
              setScene("WORLD");
              setActiveCareer(null);
              setMode("explore");
            }}
          />
        )} */}
      </WorldCanvas>

      <WorldHUD
        scene={scene}
        mode={mode}
        dialogue={currentDialogue}
        onNext={() => {
          const dialogues = CAREER_DIALOGUES[activeCareer];

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
            setActiveCareer(activeNPC);
            setDialogueIndex(0);
            setMode("dialogue");
            return;
          }

          if (mode === "career-feedback") {
            markVisited(activeCareer);

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
