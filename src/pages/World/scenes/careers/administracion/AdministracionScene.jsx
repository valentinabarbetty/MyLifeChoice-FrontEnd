import BaseCareerScene from "../BaseCareerScene";
import { administracionIntroDialogues } from "./AdministracionDialogues";

export default function AdministracionScene({ mode, setMode, dialogueIndex }) {
  const safeIndex = dialogueIndex ?? 0;

  const currentDialogue =
    administracionIntroDialogues[safeIndex] || administracionIntroDialogues[0];

  return (
    <BaseCareerScene
      careerId="administracion"
      currentAnimation={currentDialogue?.animation}
      npcPosition={[0, 0.5, 0]}
    />
  );
}
