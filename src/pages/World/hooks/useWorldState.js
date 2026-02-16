import { useState } from "react";
import { CAREER_DIALOGUES } from "../data/careerScenes";

export function useWorldState() {
  const career = localStorage.getItem("career") || "administracion";
  const [scene, setScene] = useState("WORLD");
  const [activeCareer, setActiveCareer] = useState(null);

  const sceneConfig = CAREER_DIALOGUES[career];

  const isFirstTime = !localStorage.getItem("intro_done");

  const [mode, setMode] = useState(isFirstTime ? "intro" : "explore");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [activeNPC, setActiveNPC] = useState(null);

  return {
    career,
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
    setActiveCareer
  };
}
