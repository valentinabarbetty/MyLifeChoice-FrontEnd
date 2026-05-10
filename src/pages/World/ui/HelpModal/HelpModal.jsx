import { useEffect, useRef } from "react";
import "./HelpModal.css";

export default function HelpModal({ open, onClose }) {
  const modalRef    = useRef(null);
  const closeBtnRef = useRef(null);
  const announcerRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const focusId = setTimeout(() => closeBtnRef.current?.focus(), 100);

    const announceId = setTimeout(() => {
      if (!announcerRef.current) return;
      announcerRef.current.textContent = "";
      requestAnimationFrame(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent =
            "Cómo jugar. " +
            "Objetivo: Explora el mundo y completa todas las carreras profesionales. " +
            "Movimiento: usa las flechas del teclado. " +
            "Interacción: acércate a los personajes y haz clic para hablar. " +
            "Diálogos: usa el botón siguiente para avanzar. " +
            "Progreso: completa cada carrera para desbloquear la siguiente. " +
            "Presiona Escape o el botón Entendido para cerrar.";
        }
      });
    }, 300);

    return () => { clearTimeout(focusId); clearTimeout(announceId); };
  }, [open]);

  useEffect(() => {
    if (!open || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    const trap = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
  };

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        ref={announcerRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div className="modal-container help-modal-container" ref={modalRef}>
        <div className="modal-header">
          <h2 id="help-modal-title">
            <span aria-hidden="true">🎮 </span>
            ¿Cómo jugar?
          </h2>
          <button
            ref={closeBtnRef}
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar modal de ayuda"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="modal-body" role="list" aria-label="Instrucciones del juego">

          <div
            className="help-section"
            role="listitem"
            aria-label="Objetivo: Explora el mundo y completa todas las carreras profesionales"
          >
            <div className="help-icon" aria-hidden="true">🎯</div>
            <div className="help-content" aria-hidden="true">
              <h4>Objetivo</h4>
              <p>Explora el mundo y completa todas las carreras profesionales</p>
            </div>
          </div>

          <div
            className="help-section"
            role="listitem"
            aria-label="Movimiento: usa las teclas de flecha arriba, abajo, izquierda y derecha para moverte"
          >
            <div className="help-icon" aria-hidden="true">🎮</div>
            <div className="help-content" aria-hidden="true">
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

          <div
            className="help-section"
            role="listitem"
            aria-label="Interacción: acércate a los personajes y haz clic en ellos para hablar"
          >
            <div className="help-icon" aria-hidden="true">💬</div>
            <div className="help-content" aria-hidden="true">
              <h4>Interacción</h4>
              <p>Acércate a los NPCs y haz clic en ellos para hablar</p>
            </div>
          </div>

          <div
            className="help-section"
            role="listitem"
            aria-label="Diálogos: usa el botón siguiente para avanzar en la conversación"
          >
            <div className="help-icon" aria-hidden="true">📖</div>
            <div className="help-content" aria-hidden="true">
              <h4>Diálogos</h4>
              <p>Usa el botón → para avanzar en la conversación</p>
            </div>
          </div>

          <div
            className="help-section"
            role="listitem"
            aria-label="Progreso: completa cada carrera para desbloquear la siguiente"
          >
            <div className="help-icon" aria-hidden="true">🏆</div>
            <div className="help-content" aria-hidden="true">
              <h4>Progreso</h4>
              <p>Completa cada carrera para desbloquear la siguiente</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="modal-btn modal-btn-primary"
            onClick={onClose}
            aria-label="Entendido, cerrar instrucciones"
          >
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
}