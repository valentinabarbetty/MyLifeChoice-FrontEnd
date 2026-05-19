import { useState, useMemo, useRef } from "react";
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

  const announcerRef = useRef(null);

  const announce = (msg) => {
    if (!announcerRef.current) return;
    announcerRef.current.textContent = "";
    requestAnimationFrame(() => {
      if (announcerRef.current) announcerRef.current.textContent = msg;
    });
  };

  const showAccessibleAlert = async ({
    icon,
    title,
    text,
    timer = null,
    showConfirmButton = true,
    confirmButtonColor = "#f59e0b",
  }) => {
    const previouslyFocused = document.activeElement;

    const swalConfig = {
      icon,
      title,
      text,
      showConfirmButton,
      confirmButtonText: showConfirmButton ? "Aceptar" : undefined,
      confirmButtonColor,
      backdrop: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        if (confirmButton) {
          confirmButton.focus();
          confirmButton.setAttribute("aria-label", `Cerrar alerta: ${title}`);
        }

        const popup = Swal.getPopup();
        if (popup) {
          popup.setAttribute("role", "alertdialog");
          popup.setAttribute("aria-modal", "true");
          popup.setAttribute("aria-label", title || text);
        }
      },
      willClose: () => {
        if (previouslyFocused && previouslyFocused.focus) {
          previouslyFocused.focus();
        }
      },
    };

    if (timer) {
      swalConfig.timer = timer;
      swalConfig.timerProgressBar = true;
      swalConfig.showConfirmButton = false;

      setTimeout(() => {
        announce(
          `Alerta: ${text}. Se cerrará automáticamente en ${timer / 1000} segundos.`
        );
      }, 100);
    }

    return Swal.fire(swalConfig);
  };

  const animationState = useMemo(() => {
    switch (dialogueIndex) {
      case 0:  return "greet";
      case 4:  return "victory";
      default: return "idle";
    }
  }, [dialogueIndex]);

  const handleNext = async () => {
    if (dialogueIndex === 3 && !playerName.trim()) {
      announce("Error: por favor escribe tu nombre antes de continuar.");
      await showAccessibleAlert({
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
          .then(() => console.log("Nickname sincronizado con backend"))
          .catch((err) => console.error("Error actualizando nickname:", err));
      }
    }

    if (dialogueIndex >= dialogues.length - 1) {
      onDialogueEnd?.();
      return;
    }

    setDialogueIndex((prev) => prev + 1);
  };

  const handleSessionEnd = () => setDialogueIndex((i) => i + 1);

  return (
    <div className="dialogue-flow-container">
      <div
        ref={announcerRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

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