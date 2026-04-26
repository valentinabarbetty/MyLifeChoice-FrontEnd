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
      npcPosition={[-0.5, 0.5, 1]} 
      playerScale={0.7}
      playerPosition={[-0.3, 0.4, 2]}
      npcScale={0.7}
    />
  );
}