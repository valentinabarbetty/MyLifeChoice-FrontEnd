import { useState } from "react";
import SelectGuide from "./components/SelectGuide/SelectGuide";
import DialogueFlow from "./components/DialogueFlow/DialogueFlow";


export default function IntroFlow() {
  const [step, setStep] = useState(1);
  const [guide, setGuide] = useState(null);
  const [playerName, setPlayerName] = useState(
    localStorage.getItem("playerName") || ""
  );

  const nextStep = () => setStep((prev) => prev + 1);

  return (
    <div className="introflow-container">
      {step === 1 && (
        <SelectGuide
          onSelect={(g) => {
            setGuide(g);
            nextStep();
          }}
        />
      )}
      {step === 2 && (
        <DialogueFlow
          guide={guide}
          playerName={playerName}
          onNameSet={setPlayerName}
          onDialogueEnd={() => setStep(3)} // pasa a la sesión
        />
      )}

      {step === 3 && (
        <InstructionsStep
          playerName={playerName}
          onFinish={() => console.log("🎮 Inicia el juego")}
        />
      )}
    </div>
  );
}
