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

  const bubbleRef = useRef(null);

  // Al cambiar caso, foco al texto del personaje — VoiceOver lo lee automáticamente
  useEffect(() => {
    if (bubbleRef.current) {
      bubbleRef.current.focus();
    }
  }, [index]);

  const current = cases[index];

  const handleContinue = () => {
    if (!selected) {
      return Swal.fire({
        title: "Selecciona una opción",
        text: "Debes elegir una respuesta",
        icon: "warning",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
      });
    }

    if (selected !== current.correct) {
      return Swal.fire({
        title: "No es correcto",
        text: "Intenta nuevamente",
        icon: "warning",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
      });
    }

    if (index === cases.length - 1) {
      setGameFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      return;
    }

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
              tabIndex={0}
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
          role="group"
          aria-label="Opciones de respuesta"
        >
          {options.map((opt) => (
            <OptionCard
              key={opt.value}
              title={opt.label}
              image={opt.image}
              isActive={selected === opt.value}
              onClick={() => setSelected(opt.value)}
            />
          ))}
        </div>

        <button className="generic-game-btn" onClick={handleContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
}