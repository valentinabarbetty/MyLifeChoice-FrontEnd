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
    <div className="game-complete-overlay">
      {showConfetti && <ConfettiEffect />}

      <div className="game-complete-modal">
  
        <div className="game-complete-icon">🏆</div>
        
        <h1 className="game-complete-title">{title}</h1>
        
        <div className="game-complete-divider"></div>
        
        <p className="game-complete-message">{message}</p>
        
        {extra && <div className="game-complete-extra">{extra}</div>}
        
        <button className="game-complete-btn" onClick={onContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
}