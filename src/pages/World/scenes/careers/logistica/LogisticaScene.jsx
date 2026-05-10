import BaseCareerScene from "../BaseCareerScene";
import {
  logisticaIntroDialogues,
  logisticaEndingDialogues,
} from "./LogisticaDialogues";

export default function LogisticaScene({ mode, dialogueIndex }) {
  const safeIndex = dialogueIndex ?? 0;

  const dialogues =
    mode === "career-ending"
      ? logisticaEndingDialogues
      : logisticaIntroDialogues;

  const currentDialogue = dialogues[safeIndex] || dialogues[0];

  return (
    <BaseCareerScene
      careerId="logistica"
      currentAnimation={currentDialogue?.animation}
      npcPosition={[-1.4, 0.5, -0.5]} 
    />
  );
}