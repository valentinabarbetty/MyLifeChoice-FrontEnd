import { useState } from "react";
import DialogueBox from "../../components/DialogueBox/DialogueBox";
import GuideSelect from "../ChooseGuide/ChooseGuide";

export default function IntroFlow({ onFinish }) {
  const [step, setStep] = useState(1);        // controla en qué parte del flujo estamos
  const [guide, setGuide] = useState(null);   // guarda el guía elegido
  const [dialogueIndex, setDialogueIndex] = useState(0); // controla los textos

  // Lista general de textos (igual para todos los guías)
  const dialogues = [
    "¡Hola! Me alegra conocerte.",
    "Soy tu guía en este viaje por My Life Choice.",
    "Aquí podrás aprender a moverte, explorar y descubrir tus fortalezas.",
    "Usa las flechas ← ↑ ↓ → para moverte.",
    "Da clic en la flecha para continuar cuando estés lista.",
  ];

  // Avanzar al siguiente texto
  const handleNextDialogue = () => {
    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex((prev) => prev + 1);
    } else {
      onFinish?.(); // cuando termina el último texto → pasa a la siguiente escena
    }
  };

  return (
    <div
      className="intro-container"
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "linear-gradient(180deg, #b8e1ff 0%, #fef9e1 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Paso 1 → selección de guía */}
      {step === 1 && (
        <>

          <GuideSelect
            onSelect={(selected) => {
              setGuide(selected);
              setStep(2); // 👈 cambia al paso 2 al hacer clic
            }}
          />
        </>
      )}

      {/* Paso 2 → diálogo general */}
      {step === 2 && guide && (
        <DialogueBox
          text={`${dialogues[dialogueIndex]}`}
          speaker={guide.name}
          onNext={handleNextDialogue}
        />
      )}
    </div>
  );
}
