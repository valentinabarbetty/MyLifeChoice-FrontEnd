import { useEffect, useRef, useState } from "react";
import "./Settings.css";

const STORAGE_KEYS = {
  SOUND_ENABLED: "mlc_sound_enabled",
  VOLUME: "mlc_volume",
};

const loadSavedSettings = () => {
  const savedSoundEnabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
  const savedVolume       = localStorage.getItem(STORAGE_KEYS.VOLUME);
  return {
    soundEnabled: savedSoundEnabled !== null ? savedSoundEnabled === "true" : true,
    volume:       savedVolume !== null ? parseFloat(savedVolume) : 0.4,
  };
};

const saveSettings = (soundEnabled, volume) => {
  localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, soundEnabled);
  localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString());
};

export default function Settings({ open, onClose, soundEnabled, onSoundToggle, onVolumeChange, volume }) {
  const modalRef    = useRef(null);
  const closeBtnRef = useRef(null);
  const announcerRef = useRef(null);

  const [localSoundEnabled, setLocalSoundEnabled] = useState(soundEnabled);
  const [localVolume, setLocalVolume]             = useState(volume !== undefined ? volume : 0.4);

  useEffect(() => {
    const saved = loadSavedSettings();
    setLocalSoundEnabled(saved.soundEnabled);
    setLocalVolume(saved.volume);
    if (onSoundToggle && saved.soundEnabled !== soundEnabled) onSoundToggle(saved.soundEnabled, saved.volume);
    if (onVolumeChange && saved.volume !== volume) onVolumeChange(saved.volume);
  }, []);

  useEffect(() => {
    if (soundEnabled !== undefined && soundEnabled !== localSoundEnabled) setLocalSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    if (volume !== undefined && volume !== localVolume) setLocalVolume(volume);
  }, [volume]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;

    const focusId    = setTimeout(() => closeBtnRef.current?.focus(), 100);
    const announceId = setTimeout(() => {
      if (!announcerRef.current) return;
      announcerRef.current.textContent = "";
      requestAnimationFrame(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent =
            `Configuración. ` +
            `Música de fondo: ${localSoundEnabled ? "activada" : "desactivada"}. ` +
            (localSoundEnabled ? `Volumen: ${Math.round(localVolume * 100)} por ciento. ` : "") +
            `Presiona Escape o el botón Guardar y Cerrar para salir.`;
        }
      });
    }, 300);
    return () => {
      clearTimeout(focusId);
      clearTimeout(announceId);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open || !modalRef.current) return;
    const getFocusable = () =>
      Array.from(modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter((el) => !el.disabled);

    const trap = (e) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [open, localSoundEnabled]); 

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
  };

  const announce = (msg) => {
    if (!announcerRef.current) return;
    announcerRef.current.textContent = "";
    requestAnimationFrame(() => {
      if (announcerRef.current) announcerRef.current.textContent = msg;
    });
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setLocalVolume(newVolume);
    saveSettings(localSoundEnabled, newVolume);
    if (onVolumeChange) onVolumeChange(newVolume);
    announce(`Volumen: ${Math.round(newVolume * 100)} por ciento`);
  };

  const handleSoundToggle = (checked) => {
    setLocalSoundEnabled(checked);
    saveSettings(checked, localVolume);
    if (onSoundToggle) onSoundToggle(checked, localVolume);
    announce(`Música de fondo ${checked ? "activada" : "desactivada"}`);
  };

  const handleResetDefaults = () => {
    const defaultSoundEnabled = true;
    const defaultVolume       = 0.4;
    setLocalSoundEnabled(defaultSoundEnabled);
    setLocalVolume(defaultVolume);
    saveSettings(defaultSoundEnabled, defaultVolume);
    if (onSoundToggle)  onSoundToggle(defaultSoundEnabled, defaultVolume);
    if (onVolumeChange) onVolumeChange(defaultVolume);
    announce("Valores restaurados. Música activada, volumen al 40 por ciento.");
  };

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div
        ref={announcerRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div className="modal-container settings-modal-container" ref={modalRef}>
        <div className="modal-header">
          <h2 id="settings-modal-title">
            <span aria-hidden="true">⚙️ </span>
            Configuración
          </h2>

          <button
            ref={closeBtnRef}
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar configuración"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="modal-body">

          <div className="settings-option">
            <div className="settings-option-info" aria-hidden="true">
              <span className="settings-option-icon">🔊</span>
              <span className="settings-option-label">Música de fondo</span>
            </div>

            {/* CORREGIDO: quité el aria-label que estaba aquí, en el
                <label> que envuelve el interruptor. VoiceOver enfoca el
                <input> de adentro, no este <label>, así que ese texto
                nunca se leía — era código muerto. Ahora la única fuente
                de la etiqueta es el <input>, más abajo. */}
            {/* CORREGIDO: el checkbox oculto con clip + role="switch" no era
    confiable con VoiceOver (el clic funcionaba porque el <label>
    reenvía el clic al input, pero el cursor de VoiceOver no siempre
    lo encontraba). Un <button role="switch"> nativo es el patrón
    recomendado por WAI-ARIA: siempre aparece en el árbol de
    accesibilidad y Enter/Espacio funcionan automáticamente. */}
<button
  type="button"
  className="settings-switch"
  role="switch"
  aria-checked={localSoundEnabled}
  aria-label="Música de fondo. Presiona Enter o espacio para activar o desactivar."
  onClick={() => handleSoundToggle(!localSoundEnabled)}
>
  <span className="settings-switch-slider" aria-hidden="true" />
</button>
          </div>

          {localSoundEnabled && (
            <div className="settings-option">
              <div className="settings-option-info" aria-hidden="true">
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
                  aria-label="Volumen de la música. Utiliza las flechas para subir o bajar el volumen."
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(localVolume * 100)}
                  aria-valuetext={`${Math.round(localVolume * 100)} por ciento`}
                />
                <span className="volume-value" aria-hidden="true">
                  {Math.round(localVolume * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="settings-modal-footer">
          <button
            className="settings-modal-btn settings-modal-btn-secondary"
            onClick={handleResetDefaults}
            aria-label="Restaurar valores predeterminados: música activada y volumen al 40 por ciento"
          >
            Restaurar valores
          </button>

          <button
            className="settings-modal-btn settings-modal-btn-primary"
            onClick={onClose}
            aria-label="Guardar cambios y cerrar configuración"
          >
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}