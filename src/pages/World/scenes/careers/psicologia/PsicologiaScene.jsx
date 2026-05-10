import { useState } from "react";
import BaseCareerScene from "../BaseCareerScene";
import { psicologiaIntroDialogues } from "./PsicologiaDialogues";

export default function PsicologiaScene({ mode, setMode, dialogueIndex }) {
  const safeIndex = dialogueIndex ?? 0;

  const currentDialogue =
    psicologiaIntroDialogues[safeIndex] || psicologiaIntroDialogues[0];

  return (
    <BaseCareerScene
      careerId="psicologia"
      currentAnimation={currentDialogue?.animation}
      npcPosition={[-0.5, 0.5, -0.8]} 
      scale ={2}
    ></BaseCareerScene>
  );
}
