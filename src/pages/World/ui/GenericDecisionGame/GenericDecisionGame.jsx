import { useState } from "react";
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

  const current = cases[index];

  const handleContinue = () => {
    if (!selected) {
      return Swal.fire({
        title: "Selecciona una opción 👀",
        text: "Debes elegir una respuesta",
        icon: "warning",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
      });
    }

    if (selected !== current.correct) {
      return Swal.fire({
        title: "No es correcto 😅",
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
      <div className="generic-game-panel">

        <div className="generic-game-intro">{introText}</div>


        <div className="generic-game-npc-container">
          <img 
            src={current.image} 
            className="generic-game-npc-img" 
            alt="Personaje" 
          />
          <div className="generic-game-bubble">
            <p className="generic-game-bubble-text">"{current.text}"</p>
          </div>
        </div>

        <div className="generic-game-instruction">{instructionText}</div>

       
        <div className="generic-game-options">
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