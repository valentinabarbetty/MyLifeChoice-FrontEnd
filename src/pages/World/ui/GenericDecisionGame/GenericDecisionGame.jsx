import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import OptionCard from "../OptionCard";
import ConfettiEffect from "../Confetti";
import GameCompleteModal from "../GameCompleteModal/GameCompleteModal";
import "./GenericDecisionGame.css";

export default function GenericDecisionGame({
  cases,
  options,
  introText,
  instructionText,
  successTitle,
  successMessage,
  onComplete,
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const bubbleRef    = useRef(null);
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
    showConfirmButton = true,
  }) => {
    const previouslyFocused = document.activeElement;

    const swalConfig = {
      title,
      text,
      icon,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#f59e0b",
      background: "#fef7e7",
      backdrop: "rgba(0,0,0,0.4)",
      allowOutsideClick: false,
      allowEscapeKey: true,
      showConfirmButton,
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        if (confirmButton) {
          confirmButton.focus();
          confirmButton.setAttribute("aria-label", `Cerrar alerta: ${title}. Presiona Enter o la barra espaciadora.`);
        }

        const popup = Swal.getPopup();
        if (popup) {
          popup.setAttribute("role", "alertdialog");
          popup.setAttribute("aria-modal", "true");
          popup.setAttribute("aria-label", title);
          popup.style.borderRadius = "20px";
        }

        const content = Swal.getHtmlContainer();
        if (content) {
          content.setAttribute("aria-live", "polite");
        }
      },
      willClose: () => {
        if (previouslyFocused && previouslyFocused.focus) {
          previouslyFocused.focus();
        }
      },
    };

    return Swal.fire(swalConfig);
  };

  const current = cases[index];

  useEffect(() => {
    if (bubbleRef.current) {
      bubbleRef.current.focus();
    }

    const isFirst = index === 0;
    const optionsList = options.map((o) => o.label).join(", ");

    const contextMessage =
      (isFirst ? `${introText} ` : "") +
      `Hay ${options.length} opciones: ${optionsList}. ` +
      `Presiona Tab para pasar de una opción a otra, y Enter para elegirla. ` +
      `Cuando hayas elegido, ve al botón Continuar y presiona Enter para avanzar.`;

    const id = setTimeout(() => announce(contextMessage), 300);
    return () => clearTimeout(id);
  }, [index]);

  const handleSelectOption = (value, label) => {
    setSelected(value);
    announce(`Elegiste: ${label}. Ve al botón Continuar con tab y presiona Enter para avanzar.`);
  };

  const handleContinue = async () => {
    if (!selected) {
      announce("No has elegido ninguna opción todavía. Usa Tab para llegar a una y presiona Enter para seleccionarla.");
      await showAccessibleAlert({
        icon: "warning",
        title: "Selecciona una opción",
        text: "Debes elegir una respuesta antes de continuar.",
        showConfirmButton: true,
      });
      return;
    }
    if (selected !== current.correct) {
      announce("Esa no es la opción correcta. Elige otra e intenta de nuevo.");
      await showAccessibleAlert({
        icon: "warning",
        title: "No es correcto",
        text: "Intenta nuevamente con otra opción.",
        showConfirmButton: true,
      });
      return;
    }

    if (index === cases.length - 1) {
      announce("¡Correcto! Terminaste el minijuego.");
      setGameFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      return;
    }

    announce("Correcto. Pasando a la siguiente pregunta.");
    setIndex((i) => i + 1);
    setSelected(null);
  };

  if (gameFinished) {
    return (
      <>
        {showConfetti && <ConfettiEffect />}
        <GameCompleteModal
          title={successTitle}
          message={successMessage}
          onContinue={onComplete}
        />
      </>
    );
  }

  return (
    <div className="generic-game-overlay">
      <div
        ref={announcerRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div
        className="generic-game-panel"
        role="main"
        aria-label="Juego de decisiones"
      >
        <p
          className="generic-game-intro"
          tabIndex={0}
          style={{ outline: "none" }}
        >
          {introText}
        </p>

        <div className="generic-game-npc-container">
          <img
            src={current.image}
            className="generic-game-npc-img"
            alt=""
            aria-hidden="true"
          />
          <div className="generic-game-bubble">
            <p
              ref={bubbleRef}
              className="generic-game-bubble-text"
              tabIndex={-1}
              aria-label={`Pregunta ${index + 1} de ${cases.length}. ${current.text}`}
              style={{ outline: "none" }}
            >
              {current.text}
            </p>
          </div>
        </div>
        <p
          className="generic-game-instruction"
          tabIndex={0}
          style={{ outline: "none" }}
        >
          {instructionText}
        </p>

        <div
          className="generic-game-options"
          role="radiogroup"
          aria-label={`Opciones de respuesta, ${options.length} en total`}
        >
          {options.map((opt, i) => (
            <OptionCard
              key={opt.value}
              title={opt.label}
              image={opt.image}
              isActive={selected === opt.value}
              onClick={() => handleSelectOption(opt.value, opt.label)}
              index={i + 1}
              total={options.length}
            />
          ))}
        </div>

        <button
          className="generic-game-btn"
          onClick={handleContinue}
          aria-label={`Continuar. Pregunta ${index + 1} de ${cases.length}.`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}