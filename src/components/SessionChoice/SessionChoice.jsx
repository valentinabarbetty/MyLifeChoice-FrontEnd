import "./SessionChoice.css";

export default function SessionChoice({ onSelect }) {
  const handleGuest = () => {
    console.log("👉 Click en continuawefr como invitado");
    onSelect?.("guest");
  };

  const handleAuth = () => {
    console.log("👉 Click en aequtenticarse");
    onSelect?.("auth");
  };

  return (
    <div className="session-choice-container">
      <h3 className="session-title">¿Cómo quieres continuar?</h3>

      <div className="session-buttons">
        <button className="session-btn guest" onClick={handleGuest}>
          Continuar como invitado
        </button>

        <button className="session-btn auth" onClick={handleAuth}>
          Autenticarse
        </button>
      </div>
    </div>
  );
}
