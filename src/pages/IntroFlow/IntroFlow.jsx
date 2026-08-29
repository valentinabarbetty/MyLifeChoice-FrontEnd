import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGLTF } from "@react-three/drei";
import SelectGuide from "./components/SelectGuide/SelectGuide";
import DialogueFlow from "./components/DialogueFlow/DialogueFlow";
import SelectPlayer from "./components/SelectPlayer/SelectPlayer";
import GuideLoadingScreen from "./components/Loader/GuideLoadingScreen"; 
import { GUIDE_MODELS } from "./components/Scene3D/Scene3D"; 
import { useNavigate } from "react-router-dom";
import { completeIntro } from "../../services/userService";


const MIN_LOADING_TIME_MS = 10000;

const MAX_LOADING_TIME_MS = 13000;

export default function IntroFlow() {
  if (!localStorage.getItem("logged")) {
    localStorage.setItem("logged", "no");
  }

  const [step, setStep] = useState(1);
  const [guide, setGuide] = useState(null);
  const [playerName, setPlayerName] = useState(
    localStorage.getItem("playerName") || ""
  );

 
  const [loadingGuide, setLoadingGuide] = useState(null);

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


  useEffect(() => {
    if (!loadingGuide) return;

    let cancelled = false;
    const modelPath = GUIDE_MODELS[loadingGuide.id] || GUIDE_MODELS[1];

    const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME_MS));
    const modelReady = Promise.resolve(useGLTF.preload(modelPath)).catch(() => {});
    const maxWait = new Promise((resolve) => setTimeout(resolve, MAX_LOADING_TIME_MS));

    Promise.race([Promise.all([minDelay, modelReady]), maxWait]).then(() => {
      if (cancelled) return;
      setGuide(loadingGuide);
      setLoadingGuide(null);
      nextStep();
    });

    return () => {
      cancelled = true;
    };
  }, [loadingGuide]);

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
        {loadingGuide ? (
          <motion.div
            key="guide-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <GuideLoadingScreen guideName={loadingGuide.name} />
          </motion.div>
        ) : step === 1 ? (
          <motion.div
            key="select"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <SelectGuide onSelect={(g) => setLoadingGuide(g)} />
          </motion.div>
        ) : step === 2 ? (
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
        ) : step === 3 ? (
          <motion.div
            key="select-player"
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
        ) : null}
      </AnimatePresence>
    </div>
  );
}