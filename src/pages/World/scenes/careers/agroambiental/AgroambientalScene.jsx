import BaseCareerScene from "../BaseCareerScene";
import {
  agroambientalIntroDialogues,
  agroambientalEndingDialogues,
} from "./AgroambientalDialogues";

export default function AgroambientalScene({ mode, dialogueIndex }) {
  const safeIndex = dialogueIndex ?? 0;

  const dialogues =
    mode === "career-ending"
      ? agroambientalEndingDialogues
      : agroambientalIntroDialogues;

  const currentDialogue = dialogues[safeIndex] || dialogues[0];

  return (
    <BaseCareerScene
      careerId="agroambiental"
      currentAnimation={currentDialogue?.animation}
    />
  );
}