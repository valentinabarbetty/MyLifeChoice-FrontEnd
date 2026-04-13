import BaseCareerScene from "../BaseCareerScene";
import {
  alimentosIntroDialogues,
  alimentosEndingDialogues,
} from "./AlimentosDialogues";

export default function AlimentosScene({ mode, dialogueIndex }) {
  const safeIndex = dialogueIndex ?? 0;

  const dialogues =
    mode === "career-ending"
      ? alimentosEndingDialogues
      : alimentosIntroDialogues;

  const currentDialogue = dialogues[safeIndex] || dialogues[0];

  return (
    <BaseCareerScene
      careerId="alimentos"
      currentAnimation={currentDialogue?.animation}
    />
  );
}