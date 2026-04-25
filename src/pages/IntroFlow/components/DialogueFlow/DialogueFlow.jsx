import { useState, useMemo } from "react";
import Scene3D from "../Scene3D/Scene3D";
import DialogueBox from "../../../../components/DialogueBox/DialogueBox";
import TextInputBox from "../../../../components/TextInputBox/TextInputBox";
import SessionStep from "../SessionStep/SessionStep";
import dialoguesIntro from "../../../../data/dialogues/intro3D";
import { updateNickname } from "../../../../services/userService";
import Swal from "sweetalert2";

export default function DialogueFlow({
  guide,
  playerName,
  onNameSet,
  onDialogueEnd,
}) {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const dialogues = useMemo(() => dialoguesIntro(playerName), [playerName]);
  const isLogged = localStorage.getItem("logged") === "logged";
  const SESSION_STEP_INDEX = 5;
  const isTalking = dialogueIndex !== 0;

  const animationState = useMemo(() => {
    switch (dialogueIndex) {
      case 0:
        return "greet";
      case 1:
        return "idle";
      case 2:
        return "idle";
      case 3:
        return "idle";
      case 4:
        return "victory";
      case 5:
        return "idle";
      case 7:
        return "idle";
      default:
        return "idle";
    }
  }, [dialogueIndex]);

  const handleNext = () => {
    if (dialogueIndex === 3 && !playerName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nombre requerido",
        text: "Por favor, escribe tu nombre antes de continuar.",
      });
      return;
    }
    if (dialogueIndex === 3 && playerName.trim()) {
      localStorage.setItem("playerName", playerName);

      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        updateNickname(userEmail, playerName)
          .then(() => console.log("✅ Nickname sincronizado con backend"))
          .catch((err) =>
            console.error("❌ Error actualizando nickname:", err),
          );
      }
    }

    // Si llega al final de los diálogos, pasa al siguiente paso
    if (dialogueIndex >= dialogues.length - 1) {
      onDialogueEnd?.();
      return;
    }

    setDialogueIndex((prev) => prev + 1);
  };

  const handleSessionEnd = () => setDialogueIndex((i) => i + 1);

  return (
    <div className="dialogue-flow-container">
      {guide && (
        <Scene3D
          guideId={guide}
          showArrows={dialogueIndex === 7}
          animationState={animationState}
        />
      )}

      <div className="dialogue-container">
        {dialogueIndex === 3 && (
          <div className="input-wrapper">
            <TextInputBox
              value={playerName}
              onChange={onNameSet}
              onSubmit={handleNext}
              placeholder="Escribe tu nombre..."
            />
          </div>
        )}

        <div className="dialogue-box-wrapper" key={dialogues[dialogueIndex]}>
          <DialogueBox
            text={dialogues[dialogueIndex]}
            speaker={guide.name}
            onNext={handleNext}
            animateOnce={dialogueIndex === 0}
          />
        </div>

        {!isLogged && dialogueIndex === SESSION_STEP_INDEX && (
          <SessionStep
            guide={guide}
            playerName={playerName}
            onNext={handleSessionEnd}
          />
        )}
      </div>
    </div>
  );
}
