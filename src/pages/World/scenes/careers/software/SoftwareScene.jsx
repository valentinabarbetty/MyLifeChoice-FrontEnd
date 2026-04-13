import BaseCareerScene from "../BaseCareerScene";
import {
  softwareIntroDialogues,
  softwareEndingDialogues,
} from "./SoftwareDialogues";

export default function SoftwareScene({ mode, dialogueIndex }) {
  const safeIndex = dialogueIndex ?? 0;

  const dialogues =
    mode === "career-ending"
      ? softwareEndingDialogues
      : softwareIntroDialogues;

  const currentDialogue = dialogues[safeIndex] || dialogues[0];

  return (
    <BaseCareerScene
      careerId="software"
      currentAnimation={currentDialogue?.animation}
    />
  );
}