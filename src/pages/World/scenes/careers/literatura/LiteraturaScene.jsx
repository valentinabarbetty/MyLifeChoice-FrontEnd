import BaseCareerScene from "../BaseCareerScene";
import {
  literaturaIntroDialogues,
  literaturaEndingDialogues,
} from "./LiteraturaDialogues";

export default function LiteraturaScene({ mode, dialogueIndex }) {
  const safeIndex = dialogueIndex ?? 0;

  const dialogues =
    mode === "career-ending"
      ? literaturaEndingDialogues
      : literaturaIntroDialogues;

  const currentDialogue = dialogues[safeIndex] || dialogues[0];

  return (
    <BaseCareerScene
      careerId="literatura"
      currentAnimation={currentDialogue?.animation}
      npcPosition={[-0.5, 1, 0]} 
    />
  );
}