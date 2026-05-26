import { useEffect, useRef, useState } from "react";
import ConfettiEffect from "../Confetti";
import cheerSound from "/assets/music/Cheer.mp3";
import "./GameCompleteModal.css";

const STORAGE_KEYS = {
  SOUND_ENABLED: "mlc_sound_enabled",
  VOLUME: "mlc_volume",
};

export default function GameCompleteModal({
  title = "¡Felicidades!",
  message = "Has completado el desafío.",
  extra = null,
  onContinue,
  showConfetti = true,
}) {
  const audioRef = useRef(null);
  const hasPlayed = useRef(false);
  const titleRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.6);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const loadSettings = () => {
      const savedSoundEnabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      const savedVolume = localStorage.getItem(STORAGE_KEYS.VOLUME);
      setSoundEnabled(savedSoundEnabled !== null ? savedSoundEnabled === "true" : true);
      setVolume(savedVolume !== null ? parseFloat(savedVolume) : 0.6);
    };

    loadSettings();

    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.SOUND_ENABLED) {
        setSoundEnabled(e.newValue === "true");
      } else if (e.key === STORAGE_KEYS.VOLUME) {
        setVolume(parseFloat(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!soundEnabled) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    if (soundEnabled && !hasPlayed.current) {
      if (!audioRef.current) {
        audioRef.current = new Audio(cheerSound);
        audioRef.current.loop = false;
      }
      audioRef.current.volume = volume;
      audioRef.current.play().catch((err) => {
        //console.log("Error reproduciendo sonido:", err);
      });
      hasPlayed.current = true;
    } else if (audioRef.current && audioRef.current.volume !== volume) {
      audioRef.current.volume = volume;
    }
  }, [soundEnabled, volume]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleContinue = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onContinue();
  };

  return (
    <div className="game-complete-overlay">
      {showConfetti && <ConfettiEffect />}

      <div
        className="game-complete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="game-complete-icon" aria-hidden="true">🏆</div>

        <h1
          id="modal-title"
          ref={titleRef}
          className="game-complete-title"
          tabIndex={0}
          style={{ outline: "none" }}
        >
          {title}
        </h1>

        <div className="game-complete-divider" aria-hidden="true" />

        <p
          className="game-complete-message"
          tabIndex={0}
          style={{ outline: "none" }}
        >
          {message}
        </p>

        {extra && (
          <div
            className="game-complete-extra"
            tabIndex={0}
            style={{ outline: "none" }}
          >
            {extra}
          </div>
        )}

        <button className="game-complete-btn" onClick={handleContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
}