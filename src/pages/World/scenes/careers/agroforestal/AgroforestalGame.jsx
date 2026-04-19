import { useState } from "react";
import Swal from "sweetalert2";
import ConfettiEffect from "../../../ui/Confetti";
import GameCompleteModal from "../../../ui/GameCompleteModal/GameCompleteModal";
import OptionCard from "../../../ui/OptionCard";
import GenericDecisionGame from "../../../ui/GenericDecisionGame/GenericDecisionGame";

const CASES = [
  {
    text: "Un agricultor quema el suelo después de la cosecha.",
    correct: "mala_practica",
    image: "/assets/ui/Agroforestal/agroPerson.png",
  },
  {
    text: "Un productor planta árboles frutales junto a sus cultivos de café para dar sombra y mejorar el suelo.",
    correct: "buena_practica",
    image: "/assets/ui/Agroforestal/agroPerson.png",
  },
  {
    text: "Un ganadero tala todo el bosque para ampliar el pastizal para su ganado.",
    correct: "mala_practica",
    image: "/assets/ui/Agroforestal/agroPerson.png",
  },
  {
    text: "Un agricultor utiliza abono orgánico hecho con residuos de cosecha y estiércol animal.",
    correct: "buena_practica",
    image: "/assets/ui/Agroforestal/agroPerson.png",
  },
];

const OPTIONS = [
  { 
    value: "buena_practica", 
    label: "Buena práctica", 
    image: "/assets/ui/Agroforestal/options/right.png" 
  },
  { 
    value: "mala_practica", 
    label: "Mala práctica", 
    image: "/assets/ui/Agroforestal/options/wrong.png" 
  },
];

export default function AgroforestalGame({ onComplete }) {
  return (
    <GenericDecisionGame
      cases={CASES}
      options={OPTIONS}
      introText="Observa cada situación y selecciona si es una buena o mala práctica agroforestal."
      instructionText="Selecciona: Buena práctica o Mala práctica"
      successTitle="¡Excelente!"
      successMessage="Has identificado correctamente todas las prácticas agroforestales. ¡Sigue así!"
      onComplete={onComplete}
    />
  );
}