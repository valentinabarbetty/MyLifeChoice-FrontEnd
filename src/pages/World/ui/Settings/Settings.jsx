import { useEffect, useRef, useState } from "react";
import "./Settings.css";

const STORAGE_KEYS = {
  SOUND_ENABLED: "mlc_sound_enabled",
  VOLUME: "mlc_volume",
};

const loadSavedSettings = () => {
  const savedSoundEnabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
  const savedVolume = localStorage.getItem(STORAGE_KEYS.VOLUME);
  
  return {
    soundEnabled: savedSoundEnabled !== null ? savedSoundEnabled === "true" : true,
    volume: savedVolume !== null ? parseFloat(savedVolume) : 0.4,
  };
};

const saveSettings = (soundEnabled, volume) => {
  localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, soundEnabled);
  localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString());
};

export default function Settings({ open, onClose, soundEnabled, onSoundToggle, onVolumeChange, volume }) {
  const modalRef = useRef(null);

  const [localSoundEnabled, setLocalSoundEnabled] = useState(soundEnabled);
  const [localVolume, setLocalVolume] = useState(volume !== undefined ? volume : 0.4);

 
  useEffect(() => {
    const saved = loadSavedSettings();
    setLocalSoundEnabled(saved.soundEnabled);
    setLocalVolume(saved.volume);
    
   
    if (onSoundToggle && saved.soundEnabled !== soundEnabled) {
      onSoundToggle(saved.soundEnabled, saved.volume);
    }
    if (onVolumeChange && saved.volume !== volume) {
      onVolumeChange(saved.volume);
    }
  }, []); 


  useEffect(() => {
    if (soundEnabled !== undefined && soundEnabled !== localSoundEnabled) {
      setLocalSoundEnabled(soundEnabled);
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (volume !== undefined && volume !== localVolume) {
      setLocalVolume(volume);
    }
  }, [volume]);


  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };


  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setLocalVolume(newVolume);
    

    saveSettings(localSoundEnabled, newVolume);
    
   
    if (onVolumeChange) {
      onVolumeChange(newVolume);
    }
  };

  const handleSoundToggle = (checked) => {
    setLocalSoundEnabled(checked);
    

    saveSettings(checked, localVolume);
    

    if (onSoundToggle) {
      onSoundToggle(checked, localVolume);
    }
  };

  const handleResetDefaults = () => {
    const defaultSoundEnabled = true;
    const defaultVolume = 0.4;
    
    setLocalSoundEnabled(defaultSoundEnabled);
    setLocalVolume(defaultVolume);
    
    saveSettings(defaultSoundEnabled, defaultVolume);
    

    if (onSoundToggle) {
      onSoundToggle(defaultSoundEnabled, defaultVolume);
    }
    if (onVolumeChange) {
      onVolumeChange(defaultVolume);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-container settings-modal-container" ref={modalRef}>
        <div className="modal-header">
          <h2>⚙️ Configuración</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
    
          <div className="settings-option">
            <div className="settings-option-info">
              <span className="settings-option-icon">🔊</span>
              <span className="settings-option-label">Música de fondo</span>
            </div>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={localSoundEnabled}
                onChange={(e) => handleSoundToggle(e.target.checked)}
              />
              <span className="settings-switch-slider"></span>
            </label>
          </div>

     
          {localSoundEnabled && (
            <div className="settings-option">
              <div className="settings-option-info">
                <span className="settings-option-icon">🎵</span>
                <span className="settings-option-label">Volumen</span>
              </div>
              <div className="settings-volume">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={localVolume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
                <span className="volume-value">{Math.round(localVolume * 100)}%</span>
              </div>
            </div>
          )}


          <div className="settings-option">
            <div className="settings-option-info">
              <span className="settings-option-icon">📦</span>
              <span className="settings-option-label">Versión</span>
            </div>
            <div className="settings-controls-info">
              <span>v2.0.0</span>
            </div>
          </div>
        </div>

        <div className="settings-modal-footer">
          <button className="settings-modal-btn settings-modal-btn-secondary" onClick={handleResetDefaults}>
            Restaurar valores
          </button>
          <button className="settings-modal-btn settings-modal-btn-primary" onClick={onClose}>
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}