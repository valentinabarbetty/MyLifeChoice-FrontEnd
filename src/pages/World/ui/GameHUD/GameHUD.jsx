import "./GameHUD.css";

export default function GameHUD({ mode }) {
  return (
    <div className="hud">
      {mode === "explore" && <p>🧭 Explora el mundo</p>}
      {mode === "interact" && <p>💬 Interactúa con NPCs</p>}
      {mode === "career-game" && <p>🎮 Completa el reto</p>}
    </div>
  );
}