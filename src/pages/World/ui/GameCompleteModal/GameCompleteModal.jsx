import ConfettiEffect from "../Confetti";
import "./GameCompleteModal.css";

export default function GameCompleteModal({
  title = "🎉 ¡Felicidades!",
  message = "Has completado el desafío.",
  extra = null,
  onContinue,
  showConfetti = true,
}) {
  return (
    <div className="overlay">
      {showConfetti && <ConfettiEffect />}

      <div className="panel">
        <h1 className="title">{title}</h1>

        <p className="subtitle">{message}</p>

        {extra && <div className="extra">{extra}</div>}

        <button className="gamefinished-btn" onClick={onContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
}