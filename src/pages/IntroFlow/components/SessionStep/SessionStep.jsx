import { useState, useEffect, useMemo } from "react";
import Scene3D from "../Scene3D/Scene3D";
import DialogueBox from "../../../../components/DialogueBox/DialogueBox";
import AuthModal from "../../../../components/AuthModal/AuthModal";
import dialoguesIntro from "../../../../data/dialogues/intro3D";
import "./SessionStep.css";
import RegisterModal from "../../../../components/RegisterModal/RegisterModal";
export default function SessionStep({ guide, playerName, onNext }) {
  const [sessionType, setSessionType] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dialogues = useMemo(() => dialoguesIntro(playerName), [playerName]);

  const handleSelectSession = (type) => {
    console.log("🟢 handleSelectSession ejecutado con tipo:", type);
    setSessionType(type);
    localStorage.setItem("sessionType", type);

    if (type === "guest") {
      console.log("Continuando como invitado...");
      onNext(); // pasa directamente
    } else if (type === "auth") {
      console.log("Mostrando modal de autenticación...");
      setShowAuthModal(true);
    }
  };

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
    setIsAuthenticated(true);
  };

  useEffect(() => {
    console.log("🔄 isAuthenticated cambió:");
    if (isAuthenticated) {
      console.log("👋 Cerrando modal tras autenticación...");
      setTimeout(() => {
        setShowAuthModal(false);
        onNext(); // continuar el flujo
      }, 300);
    }
  }, [isAuthenticated]);

  return (
    <div className="choose-guide-container">

      <div className="dialogue-container">
        {/* Botones */}
        <div className="input-wrapper">
          <div className="session-choice-container">
            <h3 className="session-title">¿Cómo quieres continuar?</h3>

            <div className="session-buttons">
              <button
                className="session-btn guest"
                onClick={() => handleSelectSession("guest")}
              >
                Continuar como invitado
              </button>

              <button
                className="session-btn auth"
                onClick={() => handleSelectSession("auth")}
              >
                Autenticarse
              </button>
            </div>
          </div>
        </div>

    
      </div>


      {showAuthModal && (
        <RegisterModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
          onNext={onNext}
        />
      )}
    </div>
  );
}
