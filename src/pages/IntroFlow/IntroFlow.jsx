import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SelectGuide from "./components/SelectGuide/SelectGuide";
import DialogueFlow from "./components/DialogueFlow/DialogueFlow";
import SelectPlayer from "./components/SelectPlayer/SelectPlayer";
import { useNavigate } from "react-router-dom";
import { completeIntro } from "../../services/userService";


export default function IntroFlow() {
  if (!localStorage.getItem("logged")) {
    localStorage.setItem("logged", "no");
  }

  const [step, setStep] = useState(1);
  const [guide, setGuide] = useState(null);
  const [playerName, setPlayerName] = useState(
    localStorage.getItem("playerName") || ""
  );

  const nextStep = () => setStep((prev) => prev + 1);
  const navigate = useNavigate();

const goToWorld = async () => {
  const userId = localStorage.getItem("userId");
  const guideId = localStorage.getItem("selectedGuide"); 

  if (userId && guideId) {
    await completeIntro(userId, guideId);
  }

  localStorage.setItem("intro_done", "true");
  navigate("/world");
};

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

        {step === 3 && (
          <motion.div
            key="select"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <SelectPlayer
              onSelect={(g) => {
                setTimeout(async () => {
                  setGuide(g);
                  nextStep();
                  await goToWorld();
                }, 300);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
