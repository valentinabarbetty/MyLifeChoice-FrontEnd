import { Suspense, useEffect, useState } from "react";
import { useWorldState } from "./hooks/useWorldState";
import { useNPCProximity } from "./hooks/useNPCProximity";
import WorldCanvas from "./WorldCanvas";
import WorldScene from "./scenes/WorldScene";
import WorldHUD from "./ui/WorldHUD/WorldHUD";
import { useUserProgress } from "./hooks/useUserProgress";
import { CAREER_DIALOGUES } from "./data/careerScenes";

import { ALL_CAREERS } from "./data/careersList";
import CareerRouter from "./scenes/careers/CareerRouter";
import { useMemo } from "react";
import CameraManager from "./camera/FollowCamera";
import { GAME_COMPONENTS } from "./GamesRegistry";
import { getUserProgress, saveProgress } from "../../services/userService";
import { NPCS } from "./data/npcsInfo";
import { Physics } from "@react-three/rapier";
import BackButton from "./ui/BackButton/BackButton";
import Loader from "./ui/Loader/Loader";
import HelpModal from "./ui/HelpModal/HelpModal";
import CareerSummary from "../Summary/Summary";
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
  const SAFE_ZONE = {
    minX: -5,
    maxX: 20,
    minZ: -30,
    maxZ: 0,
  };
  // useEffect(() => {
  //   console.log("Player position:", playerPos);
  // }, [playerPos]);
  const { visited, markVisited } = useUserProgress();
  const ActiveGame = GAME_COMPONENTS[activeCareer];
  const availableCareers = ALL_CAREERS.filter((c) => {
    const npc = NPCS[c];
    return npc && !visited.includes(npc.id);
  });
  const [loading, setLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const visibleCareers = availableCareers.slice(0, 3);
  //..........
  const allCompleted = availableCareers.length === 0;
  useEffect(() => {
  if (allCompleted) {
    setScene("SUMMARY");
  }
}, [allCompleted]);
  const ROUTES = [
    // Ruta izquierda (zona oeste)
    [
      [-6, -3, -5],
      [-2, -3, -5],
      [-2, -3, -20],
      [-6, -3, -20],
    ],

    // Ruta central
    [
      [2, -3, -8],
      [10, -3, -8],
      [10, -3, -25],
      [2, -3, -25],
    ],

    // Ruta derecha (zona este)
    [
      [15, -3, -6],
      [24, -3, -6],
      [24, -3, -22],
      [15, -3, -22],
    ],
  ];
  const SPAWNS = [
    [-3, -3, -7],
    [6, -3, -10],
    [16, -3, -8],
  ];
  const worldNPCs = useMemo(() => {
    return visibleCareers.reduce((acc, careerId, index) => {
      acc[careerId] = {
        id: careerId,
        model: `/assets/models/npc/${careerId}.glb`,
        route: ROUTES[index] || ROUTES[0],
        position: SPAWNS[index] || [0, -3, 0], // 🔥 NUEVO
      };
      return acc;
    }, {});
  }, [visibleCareers]);
  // useEffect(() => {
  //   const userId = localStorage.getItem("userId");

  //   if (!userId) {
  //     const local = JSON.parse(localStorage.getItem("mlc_progress"));
  //     if (local?.visited) {
  //       setVisited(local.visited);
  //     }
  //     return;
  //   }

  //   getUserProgress(userId)
  //     .then((data) => {
  //       setVisited(data.visited);

  //       // sincroniza localStorage
  //       localStorage.setItem("mlc_progress", JSON.stringify(data));
  //     })
  //     .catch(() => {
  //       console.log("Error cargando progreso");
  //     });

  // }, []);
  //   useEffect(() => {
  //   setLoading(true);

  //   const timeout = setTimeout(() => {
  //     setLoading(false);
  //   }, 1500); // simula carga

  //   return () => clearTimeout(timeout);
  // }, []);
  const [npcPositions, setNpcPositions] = useState({});

  const nearNPC = useNPCProximity(playerPos, npcPositions);
  const careerData = CAREER_DIALOGUES[activeCareer];

  const currentDialogue =
    scene === "CAREER" && activeCareer && careerData && mode !== "career-game"
      ? careerData[mode === "career-ending" ? "ending" : "intro"]?.[
          dialogueIndex
        ]
      : null;

  return (
    <>
      <BackButton />

      <button
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
        }}
        onClick={() => setHelpOpen(true)}
      >
        ❓
      </button>

      <WorldCanvas>
        <Suspense fallback={<Loader />}>
          {scene === "WORLD" && (
            <Physics gravity={[0, -9.8, 0]} debug>
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
            </Physics>
          )}

          {scene === "CAREER" && activeCareer && mode !== "career-game" && (
            <CareerRouter
              key={activeCareer}
              careerId={activeCareer}
              mode={mode}
              setMode={setMode}
              setDialogueIndex={setDialogueIndex}
            />
          )}

          <CameraManager scene={scene} mode={mode} playerPos={playerPos} />
        </Suspense>
      </WorldCanvas>
      {scene === "CAREER" && mode === "career-game" && ActiveGame && (
        <ActiveGame
          onComplete={() => {
            setMode("career-ending");
            setDialogueIndex(0);
          }}
        />
      )}
      {scene === "SUMMARY" && <CareerSummary />}
      <WorldHUD
        scene={scene}
        mode={mode}
        dialogue={currentDialogue}
        onNext={() => {
          const careerData = CAREER_DIALOGUES[activeCareer];
          if (!careerData) return;

          const isEnding = mode === "career-ending";
          const phase = isEnding ? "ending" : "intro";
          const dialogues = careerData[phase];

          if (dialogueIndex + 1 < dialogues.length) {
            setDialogueIndex((i) => i + 1);
          } else {
            if (!isEnding) {
              setDialogueIndex(0);
              setMode("career-game");
            } else {
              setDialogueIndex(0);
              setMode("career-feedback");
            }
          }
        }}
        // onAccept={() => {
        //   if (mode === "interact") {
        //     setScene("CAREER");
        //     setActiveCareer(activeNPC);
        //     setDialogueIndex(0);
        //     setMode("dialogue");
        //     return;
        //   }

        //   // if (mode === "career-feedback") {
        //   //   markVisited(activeCareer);

        //   //   setScene("WORLD");
        //   //   setActiveCareer(null);
        //   //   setActiveNPC(null);
        //   //   setDialogueIndex(0);

        //   //   setMode("explore");
        //   // }
        //   if (mode === "career-feedback") {

        //     await saveProgress({
        //       user_id: localStorage.getItem("userId"),
        //       career_id: activeCareer,
        //       state: "done",
        //       feedback: "liked"
        //     });

        //     markVisited(activeCareer);

        //     setScene("WORLD");
        //     setActiveCareer(null);
        //     setActiveNPC(null);
        //     setDialogueIndex(0);
        //     setMode("explore");
        //   }
        // }}
        onAccept={async () => {
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
        activeNPC={activeNPC}
          activeCareer={activeCareer}

      />
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
