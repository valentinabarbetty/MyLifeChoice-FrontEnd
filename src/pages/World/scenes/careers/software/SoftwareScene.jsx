import { useState } from "react";
import BaseCareerScene from "../BaseCareerScene";
import { softwareIntroDialogues } from "./SoftwareDialogues"; // Ajusta el nombre

export default function SoftwareScene({ mode, setMode, dialogueIndex }) {
  const safeIndex = dialogueIndex ?? 0;

  const currentDialogue =
    softwareIntroDialogues[safeIndex] || softwareIntroDialogues[0];

  return (
    <BaseCareerScene
      careerId="software"
      currentAnimation={currentDialogue?.animation}
      npcPosition={[-1.2, 0, -0.5]}  
    />
  );
}