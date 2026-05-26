import GenericDecisionGame from "../../../ui/GenericDecisionGame/GenericDecisionGame";

const CASES = [
  {
    text: "Un río cerca de un cultivo tiene basura flotando y el agua se ve oscura y con mal olor.",
    correct: "contaminacion_agua",
    image: "/assets/ui/Literatura/litPerson.png",
  },
  {
    text: "Después de una tormenta fuerte, la capa fértil del suelo se está perdiendo y quedan surcos profundos en la tierra.",
    correct: "erosion_suelo",
    image: "/assets/ui/Psicologia/person4.png",
  },
  {
    text: "Las temperaturas han aumentado en los últimos años, los patrones de lluvia cambiaron y las cosechas ya no son como antes.",
    correct: "cambio_climatico",
    image: "/assets/ui/Software/personajes/person.png",
  },
  {
    text: "Lleva más de 6 meses sin llover, los animales están muriendo y los cultivos no crecen.",
    correct: "sequia",
    image: "/assets/ui/Agroambiental/person.png",
  },
];

const OPTIONS = [
  { 
    value: "contaminacion_agua", 
    label: "Contaminación del agua", 
    image: "/assets/ui/Agroambiental/options/water_pollution.png" 
  },
  { 
    value: "erosion_suelo", 
    label: "Erosión del suelo", 
    image: "/assets/ui/Agroambiental/options/erosion.png" 
  },
  { 
    value: "cambio_climatico", 
    label: "Cambio climático", 
    image: "/assets/ui/Agroambiental/options/climate_change.png" 
  },
  { 
    value: "sequia", 
    label: "Sequía", 
    image: "/assets/ui/Agroambiental/options/drought.png" 
  },
];

export default function AgroambientalGame({ onComplete }) {
  return (
    <GenericDecisionGame
      cases={CASES}
      options={OPTIONS}
      introText="Identifica qué tipo de problema ambiental representa cada situación."
      instructionText="Selecciona la problemática ambiental:"
      successTitle="¡Excelente!"
      successMessage="Has identificado correctamente todas las problemáticas ambientales. ¡Sigue así!"
      onComplete={onComplete}
    />
  );
}