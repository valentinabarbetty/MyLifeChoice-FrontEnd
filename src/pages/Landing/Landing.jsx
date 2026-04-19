import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Landing.css";
import vid from "/assets/gameplay.mp4";
import logo from "/assets/logo.PNG";
import AuthModal from "../../components/AuthModal/AuthModal";
import { checkIntroStatus } from "../../services/userService";
import landingMusic from "/assets/music/Landing.mp3";
import { useEffect, useRef, useState } from "react";
export default function Landing() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasProgress, setHasProgress] = useState(false);
  const handleLoginClick = () => {
    setShowLoginModal(true);
  };
  const audioRef = useRef(null);
  useEffect(() => {
    audioRef.current = new Audio(landingMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    audioRef.current.play().catch(() => {
      console.log("Autoplay bloqueado por el navegador");
    });

    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);
  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      checkIntroStatus(userId)
        .then((res) => setHasProgress(res.has_intro))
        .catch((err) => console.error("Error checking intro:", err));
    }
    console.log(localStorage.getItem("logged"));
  }, []);
  const handleLoginSuccess = async (userData) => {
    console.log("✅ Login exitoso:", userData);
    if (userData?.nickname) {
      localStorage.setItem("playerName", userData.nickname);
    } else if (userData?.email) {
      const nameFromEmail = userData.email.split("@")[0];
      localStorage.setItem("playerName", nameFromEmail);
    }

    localStorage.setItem("sessionType", "auth");
    localStorage.setItem("logged", "logged");
    try {
      const res = await checkIntroStatus(userId);
      setHasProgress(res.has_intro);
    } catch (err) {
      console.error("Error checking intro:", err);
    }

    setShowLoginModal(false);

    // setIsAuthenticated(true);
  };
  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("playerName");
    localStorage.removeItem("logged");
    localStorage.removeItem("selectedGuide");
    localStorage.removeItem("mlc_progress");
    localStorage.removeItem("sessionType");

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
      <div className="login-container">
        {localStorage.getItem("logged") === "logged" ? (
          <button className="btn-login" onClick={logout}>
            Cerrar Sesión
          </button>
        ) : (
          <button className="btn-login" onClick={() => setShowLoginModal(true)}>
            Iniciar Sesión
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
          <button
            className="btn-primary"
            onClick={() => {
              stopMusic();
              navigate("/intro");
            }}
          >
            Empezar Nueva Aventura
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => {
              stopMusic();
              navigate("/world");
            }}
          >
            Continuar Partida
          </button>
        )}
        {showLoginModal && (
          <AuthModal
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </motion.div>
    </div>
  );
}
