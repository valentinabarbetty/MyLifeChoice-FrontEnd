import BaseCareerScene from "../BaseCareerScene";
import {
  educacionFisicaIntroDialogues,
  educacionFisicaEndingDialogues,
} from "./educacionFisicaDialogues";

export default function EducacionFisicaScene({ mode, dialogueIndex }) {
  const safeIndex = dialogueIndex ?? 0;

  const dialogues =
    mode === "career-ending"
      ? educacionFisicaEndingDialogues
      : educacionFisicaIntroDialogues;

  const currentDialogue = dialogues[safeIndex] || dialogues[0];

  return (
    <BaseCareerScene
      careerId="educacionFisica"
      currentAnimation={currentDialogue?.animation}
    />
  );
}