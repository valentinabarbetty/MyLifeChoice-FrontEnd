
import GenericDecisionGame from "../../../ui/GenericDecisionGame";
const OPTIONS = [
  {
    value: "diseno",
    label: "Diseño",
    emoji: "🎨",
  },
  {
    value: "logica",
    label: "Programar la lógica",
    emoji: "💡",
  },
  {
    value: "datos",
    label: "Guardar información",
    emoji: "📁",
  },
  {
    value: "testing",
    label: "Corregir errores",
    emoji: "🐞",
  },
];
const CASES = [
  {
    text: "Debo crear los botones y colores de una aplicación para que los usuarios puedan usarla fácilmente.",
    correct: "diseno",
  },
  {
    text: "Necesito implementar la funcionalidad para que los usuarios puedan iniciar sesión.",
    correct: "logica",
  },
  {
    text: "Debo almacenar la información de los usuarios en una base de datos.",
    correct: "datos",
  },
  {
    text: "La aplicación tiene fallos y errores que deben solucionarse.",
    correct: "testing",
  },
];


export default function SoftwareGame({ onComplete }) {
  return (
    <GenericDecisionGame
      cases={CASES}
      options={OPTIONS}
      npcImage="/assets/ui/Tecnologia/dev.png"
      introText="Estoy desarrollando una app... ¿me ayudas?"
      instructionText="Selecciona la fase del desarrollo:"
      successTitle="💻 ¡Excelente!"
      successMessage="Has identificado correctamente las fases."
      onComplete={onComplete}
    />
  );
}