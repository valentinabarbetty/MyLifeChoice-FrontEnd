import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    <div
      className="introflow-container"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "linear-gradient(180deg, #b8e1ff 0%, #fef9e1 100%)",
      }}
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="select"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <SelectGuide
              onSelect={(g) => {
                // Fade-out con pequeño retraso
                setTimeout(() => {
                  setGuide(g);
                  nextStep();
                }, 300);
              }}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="dialogue"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <DialogueFlow
              guide={guide}
              playerName={playerName}
              onNameSet={setPlayerName}
              onDialogueEnd={() => setStep(3)}
            />
          </motion.div>
        )}

        
      </AnimatePresence>
    </div>
  );
}
