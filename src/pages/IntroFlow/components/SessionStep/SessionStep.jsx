import { useState, useEffect, useMemo } from "react";
import dialoguesIntro from "../../../../data/dialogues/intro3D";
import "./SessionStep.css";
import RegisterModal from "../../../../components/RegisterModal/RegisterModal";

export default function SessionStep({ guide, playerName, onNext }) {
  const [sessionType, setSessionType] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dialogues = useMemo(() => dialoguesIntro(playerName), [playerName]);

  const handleSelectSession = (type) => {
    setSessionType(type);
    localStorage.setItem("sessionType", type);

    if (type === "guest") {
      onNext();
    } else if (type === "auth") {
      setShowAuthModal(true);
    }
  };

  const handleLoginSuccess = (userData) => {
    if (userData?.nickname) {
      localStorage.setItem("playerName", userData.nickname);
    } else if (userData?.email) {
      localStorage.setItem("playerName", userData.email.split("@")[0]);
    }
    localStorage.setItem("sessionType", "auth");
    localStorage.setItem("logged", "logged");
    setIsAuthenticated(true);
  };

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        setShowAuthModal(false);
        onNext();
      }, 300);
    }
  }, [isAuthenticated]);

  return (
    <div className="choose-guide-container">
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

      <div className="dialogue-container">
        <div className="input-wrapper">
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