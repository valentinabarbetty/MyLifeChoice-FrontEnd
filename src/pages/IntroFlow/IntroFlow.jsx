import { useState } from "react";
import DialogueBox from "../../components/DialogueBox/DialogueBox";
import GuideSelect from "../ChooseGuide/ChooseGuide";

export default function IntroFlow({ onFinish }) {
  const [step, setStep] = useState(1);        // controla en qué parte del flujo estamos
  const [guide, setGuide] = useState(null);   // guarda el guía elegido

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

      
    </div>
  );
}