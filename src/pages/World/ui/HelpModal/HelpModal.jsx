import { useEffect, useRef } from "react";
import "./HelpModal.css";

export default function HelpModal({ open, onClose }) {
  const modalRef = useRef(null);

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

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-container help-modal-container" ref={modalRef}>
        <div className="modal-header">
          <h2>🎮 ¿Cómo jugar?</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="help-section">
            <div className="help-icon">🎯</div>
            <div className="help-content">
              <h4>Objetivo</h4>
              <p>Explora el mundo y completa todas las carreras profesionales</p>
            </div>
          </div>

          <div className="help-section">
            <div className="help-icon">🎮</div>
            <div className="help-content">
              <h4>Movimiento</h4>
              <div className="help-keys">
                <span className="key">↑</span>
                <span className="key">↓</span>
                <span className="key">←</span>
                <span className="key">→</span>
              </div>
              <p>Usa las flechas del teclado para moverte</p>
            </div>
          </div>

          <div className="help-section">
            <div className="help-icon">💬</div>
            <div className="help-content">
              <h4>Interacción</h4>
              <p>Acércate a los NPCs y haz clic en ellos para hablar</p>
            </div>
          </div>

          <div className="help-section">
            <div className="help-icon">📖</div>
            <div className="help-content">
              <h4>Diálogos</h4>
              <p>Usa el botón → para avanzar en la conversación</p>
            </div>
          </div>

          <div className="help-section">
            <div className="help-icon">🏆</div>
            <div className="help-content">
              <h4>Progreso</h4>
              <p>Completa cada carrera para desbloquear la siguiente</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn-primary" onClick={onClose}>
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
}