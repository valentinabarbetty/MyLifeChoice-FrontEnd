import BaseCareerScene from "../BaseCareerScene";
import {
  ingenieriaIndustrialIntroDialogues,
  ingenieriaIndustrialEndingDialogues,
} from "./IngenieriaIndustrialDialogues";

export default function IngenieriaIndustrialScene({ mode, dialogueIndex }) {
  const safeIndex = dialogueIndex ?? 0;

  const dialogues =
    mode === "career-ending"
      ? ingenieriaIndustrialEndingDialogues
      : ingenieriaIndustrialIntroDialogues;

  const currentDialogue = dialogues[safeIndex] || dialogues[0];

  return (
    <BaseCareerScene
      careerId="ingenieriaIndustrial"
      currentAnimation={currentDialogue?.animation}
      npcPosition={[0, 0.5, 0]}
    />
  );
}