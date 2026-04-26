import BaseCareerScene from "../BaseCareerScene";
import {
  agroforestalIntroDialogues,
  agroforestalEndingDialogues,
} from "./AgroforestalDialogues";

export default function AgroforestalScene({ mode, dialogueIndex }) {
  const safeIndex = dialogueIndex ?? 0;

  const dialogues =
    mode === "career-ending"
      ? agroforestalEndingDialogues
      : agroforestalIntroDialogues;

  const currentDialogue = dialogues[safeIndex] || dialogues[0];

  return (
    <BaseCareerScene
      careerId="agroforestal"
      currentAnimation={currentDialogue?.animation}
      npcPosition={[-1.2, 0.2, 0.2]}  
    />
  );
}