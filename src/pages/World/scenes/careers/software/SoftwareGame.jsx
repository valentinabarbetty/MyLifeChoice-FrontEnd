import GenericDecisionGame from "../../../ui/GenericDecisionGame/GenericDecisionGame";

const OPTIONS = [
  {
    value: "diseno",
    label: "Diseño",
    image: "/assets/ui/Software/opciones/design.png",
  },
  {
    value: "logica",
    label: "Programar la lógica",
    image: "/assets/ui/Software/opciones/logic.png",
  },
  {
    value: "datos",
    label: "Guardar información",
    image: "/assets/ui/Software/opciones/data.png",
  },
  {
    value: "testing",
    label: "Corregir errores",
    image: "/assets/ui/Software/opciones/test.png",
  },
];

const CASES = [
  {
    text: "Debo crear los botones y colores de una aplicación para que los usuarios puedan usarla fácilmente.",
    correct: "diseno",
    image: "/assets/ui/Software/personajes/person.png",
  },
  {
    text: "Necesito implementar la funcionalidad para que los usuarios puedan iniciar sesión.",
    correct: "logica",
    image: "/assets/ui/Software/personajes/person.png",
  },
  {
    text: "Debo almacenar la información de los usuarios en una base de datos.",
    correct: "datos",
    image: "/assets/ui/Software/personajes/person.png",
  },
  {
    text: "La aplicación tiene fallos y errores que deben solucionarse.",
    correct: "testing",
    image: "/assets/ui/Software/personajes/person.png",
  },
];

export default function SoftwareGame({ onComplete }) {
  return (
    <GenericDecisionGame
      cases={CASES}
      options={OPTIONS}
      introText="Estoy desarrollando una app... ¿me ayudas?"
      instructionText="Selecciona la fase del desarrollo:"
      successTitle="¡Excelente!"
      successMessage="Has identificado correctamente las fases."
      onComplete={onComplete}
    />
  );
}