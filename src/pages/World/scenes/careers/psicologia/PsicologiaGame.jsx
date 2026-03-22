import { useState } from "react";
import Swal from "sweetalert2";
import ConfettiEffect from "../../../ui/Confetti";
import GameCompleteModal from "../../../ui/GameCompleteModal/GameCompleteModal";
import OptionCard from "../../../ui/OptionCard";
import "./PsicologiaGame.css";

/* DATA */

const CASES = [
  {
    text: "Acabo de perder un examen en la universidad, siento que no puedo alcanzar mis metas.",
    correct: "frustracion",
    image: "/assets/ui/Psicologia/person1.png",
  },
  {
    text: "Terminé una relación muy importante para mí, me siento vacío y sin ganas de nada.",
    correct: "tristeza",
    image: "/assets/ui/Psicologia/person2.png",
  },
  {
    text: "Me ascendieron en mi trabajo después de mucho esfuerzo, estoy muy emocionado.",
    correct: "felicidad",
    image: "/assets/ui/Psicologia/person3.png",
  },
  {
    text: "Recibí una noticia inesperada que no vi venir, aún no sé cómo reaccionar.",
    correct: "sorpresa",
    image: "/assets/ui/Psicologia/person4.png",
  },
];

const OPTIONS = [
  { value: "felicidad", label: "Felicidad", emoji: "🥳" },
  { value: "frustracion", label: "Frustración", emoji: "😩" },
  { value: "tristeza", label: "Tristeza", emoji: "😭" },
  { value: "sorpresa", label: "Sorpresa", emoji: "😲" },
];

export default function PsicologiaGame({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const current = CASES[index];

  const handleContinue = () => {
    if (!selected) {
      return Swal.fire({
        title: "Selecciona una opción 👀",
        text: "Debes elegir una emoción",
        icon: "warning",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
      });
    }

    if (selected !== current.correct) {
      return Swal.fire({
        title: "No es la emoción correcta 😅",
        text: "Intenta ponerte en su lugar",
        icon: "warning",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
      });
    }

    if (index === CASES.length - 1) {
      setGameFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      return;
    }

    setIndex((i) => i + 1);
    setSelected(null);
  };

  /* FINAL */

  if (gameFinished) {
    return (
      <div className="overlay">
        {showConfetti && <ConfettiEffect />}

        <GameCompleteModal
          title="🧠 ¡Excelente!"
          message="Has identificado correctamente las emociones."
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
          <img src={current.image} className="npc-img" />

          <div className="bubble">
            {current.text}
          </div>
        </div>

        <h3 className="question">
          Selecciona la emoción que corresponde:
        </h3>

        {/* 🔥 OPTIONS CON COMPONENTE */}
        <div className="options">
          {OPTIONS.map((opt) => (
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