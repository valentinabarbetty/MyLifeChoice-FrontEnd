import BaseCareerScene from "../BaseCareerScene";
import {
  mantenimientoElectromecanicoIntroDialogues,
  mantenimientoElectromecanicoEndingDialogues,
} from "./MantenimientoDialogues";

export default function MantenimientoScene({ mode, dialogueIndex }) {
  const safeIndex = dialogueIndex ?? 0;

  const dialogues =
    mode === "career-ending"
      ? mantenimientoElectromecanicoEndingDialogues
      : mantenimientoElectromecanicoIntroDialogues;

  const currentDialogue = dialogues[safeIndex] || dialogues[0];

  return (
    <BaseCareerScene
      careerId="mantenimiento"
      currentAnimation={currentDialogue?.animation}
      npcPosition={[0, 0.5, 0]}
    />
  );
}