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
    />
  );
}