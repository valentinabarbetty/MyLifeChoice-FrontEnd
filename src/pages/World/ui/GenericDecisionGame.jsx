import { useState } from "react";
import Swal from "sweetalert2";
import OptionCard from "./OptionCard";
import ConfettiEffect from "./Confetti";
import GameCompleteModal from "./GameCompleteModal/GameCompleteModal";


export default function GenericDecisionGame({
  cases,
  options,
  npcImage,
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
      });
    }

    if (selected !== current.correct) {
      return Swal.fire({
        title: "No es correcto 😅",
        text: "Intenta nuevamente",
        icon: "warning",
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
      <div className="overlay">
        {showConfetti && <ConfettiEffect />}
        <GameCompleteModal
          title={successTitle}
          message={successMessage}
          onContinue={onComplete}
        />
      </div>
    );
  }

  return (
    <div className="overlay">
      <div className="panel">

        {/* NPC */}
        <div className="npc-container">
          <img src={npcImage} className="npc-img" />

          <div className="bubble">
            {introText}
          </div>
        </div>

        <h3 className="question">{current.text}</h3>

        <p className="instruction">{instructionText}</p>

        {/* OPTIONS */}
        <div className="options">
          {options.map((opt) => (
            <OptionCard
              key={opt.value}
              title={opt.label}
              subtitle={opt.emoji}
              isActive={selected === opt.value}
              onClick={() => setSelected(opt.value)}
            />
          ))}
        </div>

        <button className="btn" onClick={handleContinue}>
          CONTINUAR
        </button>
      </div>
    </div>
  );
}