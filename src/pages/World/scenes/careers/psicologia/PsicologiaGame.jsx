import { useState } from "react";
import Swal from "sweetalert2";
import ConfettiEffect from "../../../ui/Confetti";
import GameCompleteModal from "../../../ui/GameCompleteModal/GameCompleteModal";
import OptionCard from "../../../ui/OptionCard";
import "./PsicologiaGame.css";
import GenericDecisionGame from "../../../ui/GenericDecisionGame/GenericDecisionGame";


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
  { 
    value: "felicidad", 
    label: "Felicidad", 
    image: "/assets/ui/Psicologia/emotions/happiness.png" 
  },
  { 
    value: "frustracion", 
    label: "Frustración", 
    image: "/assets/ui/Psicologia/emotions/frustrated.png" 
  },
  { 
    value: "tristeza", 
    label: "Tristeza", 
    image: "/assets/ui/Psicologia/emotions/sadness.png" 
  },
  { 
    value: "sorpresa", 
    label: "Sorpresa", 
    image: "/assets/ui/Psicologia/emotions/surprised.png" 
  },
];

export default function PsicologiaGame({ onComplete }) {
  return (
    <GenericDecisionGame
      cases={CASES}
      options={OPTIONS}
      introText="Observa la situación y selecciona la emoción correcta."
      instructionText="Selecciona la emoción:"
      successTitle="¡Excelente!"
      successMessage="Has identificado correctamente las emociones."
      onComplete={onComplete}
    />
  );
}