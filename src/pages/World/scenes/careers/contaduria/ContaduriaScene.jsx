import BaseCareerScene from "../BaseCareerScene";
import {
  contaduriaIntroDialogues,
  contaduriaEndingDialogues,
} from "./ContaduriaDialogues";

export default function ContaduriaScene({ mode, dialogueIndex }) {
  const safeIndex = dialogueIndex ?? 0;

  const dialogues =
    mode === "career-ending"
      ? contaduriaEndingDialogues
      : contaduriaIntroDialogues;

  const currentDialogue = dialogues[safeIndex] || dialogues[0];

  return (
    <BaseCareerScene
      careerId="contaduriaPublica"
      currentAnimation={currentDialogue?.animation}
    />
  );
}