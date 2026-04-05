import "./HelpModal.css";

export default function HelpModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="help-overlay">
      <div className="help-modal">
        <h2>¿Cómo jugar?</h2>

        <h4>Movimiento</h4>
        <p>Usa ⬆️ ⬇️ ⬅️ ➡️ para moverte</p>

        <h4>Interacción</h4>
        <p>Haz clic en los habitantes del mundo para hablar</p>

        <h4>Diálogos</h4>
        <p>Haz clic en → para continuar</p>

    

        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
