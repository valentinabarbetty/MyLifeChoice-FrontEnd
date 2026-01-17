import { useState } from "react";
import { CAREER_SCENES } from "../data/careerScenes";

export function useWorldState() {
  const career = localStorage.getItem("career") || "administracion";
  const sceneConfig = CAREER_SCENES[career];

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
  };
}
