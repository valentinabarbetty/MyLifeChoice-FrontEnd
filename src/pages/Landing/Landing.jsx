import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Landing.css";
import vid from "/assets/gameplay.mp4";
import logo from "/assets/logo.PNG";
import AuthModal from "../../components/AuthModal/AuthModal";

import { checkIntroStatus } from "../../services/userService";
import landingMusic from "/assets/music/Landing.mp3";
import { useEffect, useRef, useState } from "react";
import Settings from "../World/ui/Settings/Settings";
import HelpModal from "../World/ui/HelpModal/HelpModal";

export default function Landing() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [hasProgress, setHasProgress] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.4);

  const audioRef = useRef(null);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  useEffect(() => {
    audioRef.current = new Audio(landingMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    const enableAudio = () => {
      if (audioRef.current && soundEnabled) {
        audioRef.current.play().catch(() => console.log("Error al reproducir"));
      }
      window.removeEventListener("click", enableAudio);
      window.removeEventListener("keydown", enableAudio);
    };

    window.addEventListener("click", enableAudio);
    window.addEventListener("keydown", enableAudio);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.removeEventListener("click", enableAudio);
      window.removeEventListener("keydown", enableAudio);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (soundEnabled) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [soundEnabled, volume]);

 useEffect(() => {
  const isLogged = localStorage.getItem("logged") === "logged";
  const introDoneLocal = localStorage.getItem("intro_done") === "true";

  if (introDoneLocal && isLogged) {
    setHasProgress(true);
  } else if (userId) {
    checkIntroStatus(userId)
      .then((res) => setHasProgress(res.has_intro))
      .catch((err) => console.error("Error checking intro:", err));
  }
}, [userId]);

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleLoginSuccess = async (userData) => {
   // console.log("Login exitoso:", userData);

    const newUserId = userData?.user_id;
    if (newUserId) {
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
    }

    if (userData?.nickname) {
      localStorage.setItem("playerName", userData.nickname);
    } else if (userData?.email) {
      const nameFromEmail = userData.email.split("@")[0];
      localStorage.setItem("playerName", nameFromEmail);
    }

    localStorage.setItem("sessionType", "auth");
    localStorage.setItem("logged", "logged");

    try {
      const res = await checkIntroStatus(newUserId || userId);
      setHasProgress(res.has_intro);
    } catch (err) {
     // console.error("Error checking intro:", err);
    }

    setShowLoginModal(false);
  };

  const logout = () => {
    stopMusic();
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("playerName");
    localStorage.removeItem("logged");
    localStorage.removeItem("selectedGuide");
    localStorage.removeItem("mlc_progress");
    localStorage.removeItem("sessionType");
    localStorage.removeItem("careerTestResults");
    localStorage.removeItem("intro_done");  
    window.location.href = "/";
  };

  return (
    <div className="landing-container">
      <video
        className="landing-video"
        src={vid}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="overlay"></div>

      <div className="top-buttons">
        <button
          className="top-btn help-btn"
          onClick={() => setShowHelpModal(true)}
          aria-label="Ayuda"
        >
          <span className="btn-icon"></span>
          <span className="btn-text">Ayuda</span>
        </button>

        <button
          className="top-btn settings-btn"
          onClick={() => setShowSettingsModal(true)}
          aria-label="Configuración"
        >
          <span className="btn-text">Configuración</span>
        </button>
        {localStorage.getItem("logged") === "logged" ? (
          <button className="top-btn logout-btn" onClick={logout}>
            <span className="btn-text">Cerrar Sesión</span>
          </button>
        ) : (
          <button
            className="top-btn login-btn"
            onClick={() => setShowLoginModal(true)}
          >
            <span className="btn-text">Iniciar Sesión</span>
          </button>
        )}
      </div>

      <motion.img
        src={logo}
        alt="My Life Choice Logo"
        className="landing-logo"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      <motion.div
        className="landing-buttons"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        {!hasProgress ? (
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              stopMusic();
              navigate("/intro");
            }}
          >
            Empezar Nueva Aventura
          </motion.button>
        ) : (
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              stopMusic();
              navigate("/world");
            }}
          >
            Continuar Partida
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence>
        {showLoginModal && (
          <AuthModal
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {showHelpModal && (
          <HelpModal
            open={showHelpModal}
            onClose={() => setShowHelpModal(false)}
          />
        )}

        {showSettingsModal && (
          <Settings
            open={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            soundEnabled={soundEnabled}
            onSoundToggle={(enabled) => setSoundEnabled(enabled)}
            volume={volume}
            onVolumeChange={(newVolume) => setVolume(newVolume)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
