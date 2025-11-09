import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Landing.css";
import vid from "/assets/gameplay.mp4";
import logo from "/assets/logo.PNG";
import AuthModal from "../../components/AuthModal/AuthModal";
import { useEffect, useState } from "react";
import { checkUserProgress } from "../../services/userService";
export default function Landing() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasProgress, setHasProgress] = useState(false);
  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      checkUserProgress(userId)
        .then((res) => setHasProgress(res.has_progress))
        .catch((err) => console.error("Error checking user progress:", err));
    }
    console.log(localStorage.getItem('logged'))
  }, []);
  const handleLoginSuccess = (userData) => {
    console.log("✅ Login exitoso:", userData);
    if (userData?.nickname) {
      localStorage.setItem("playerName", userData.nickname);
    } else if (userData?.email) {
      const nameFromEmail = userData.email.split("@")[0];
      localStorage.setItem("playerName", nameFromEmail);
    }

    localStorage.setItem("sessionType", "auth");
    localStorage.setItem("logged", "logged");
    setShowLoginModal(false);
    
    // setIsAuthenticated(true);
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
      {localStorage.getItem("logged") !== "logged" && (
        <div className="login-container">
          <button className="btn-login" onClick={() => setShowLoginModal(true)}>
            Iniciar Sesión
          </button>
        </div>
      )}
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
        <button className="btn-primary" onClick={() => navigate("/intro")}>
          Empezar Nueva Aventura
        </button>
        {hasProgress && (
          <button className="btn-primary" onClick={() => navigate("/intro")}>
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
