
export default function InstructionsStep({ playerName, onFinish }) {
  return (
    <div className="instructions-container">
      <h2>Perfecto, {playerName || "jugador"}</h2>
      <p>Usa las flechas o las teclas W A S D para moverte.</p>
      <p>Presiona ENTER para interactuar con personajes u objetos.</p>
      <button className="start-btn" onClick={onFinish}>
        ¡Comenzar Aventura!
      </button>
    </div>
  );
}
