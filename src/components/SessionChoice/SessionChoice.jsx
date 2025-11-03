import "./SessionChoice.css";

export default function SessionChoice({ onSelect }) {
  return (
    <div className="session-choice-container">
      <h3 className="session-title">¿Cómo quieres continuar?</h3>

      <div className="session-buttons">
        <button
          className="session-btn guest"
          onClick={() => onSelect("guest")}
        >
          Continuar como invitado
        </button>

        <button
          className="session-btn auth"
          onClick={() => onSelect("auth")}
        >
          Autenticarse
        </button>
      </div>
    </div>
  );
}
