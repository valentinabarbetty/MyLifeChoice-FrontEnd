import BaseCareerScene from "../BaseCareerScene";
import {
  electronicaIndustrialIntroDialogues,
  electronicaIndustrialEndingDialogues,
} from "./ElectronicaDialogues";

export default function ElectronicaScene({ mode, dialogueIndex }) {
  const safeIndex = dialogueIndex ?? 0;

  const dialogues =
    mode === "career-ending"
      ? electronicaIndustrialEndingDialogues
      : electronicaIndustrialIntroDialogues;

  const currentDialogue = dialogues[safeIndex] || dialogues[0];

  return (
    <BaseCareerScene
      careerId="electronica"
      currentAnimation={currentDialogue?.animation}
      npcPosition={[-0.5, 1, -0.8]} 
      playerPosition={[0.5, 0.4, 1.7]}

    />
  );
}