// src/data/dialogues/intro3D.js
const dialogues_intro = (playerName) => [
  "¡Hola! Me alegra conocerte.",
  "Soy tu guía en este viaje por My Life Choice.",
  "¿Cuál es tu nombre?",
  playerName
    ? `¡Encantado de conocerte, ${playerName}!`
    : "¡Encantado de conocerte!",
  "Para moverte, usa las flechas ← ↑ ↓ → o las teclas W A S D.",
  "Intenta moverte un poco y cuando estés listo, da clic en la flecha para continuar tu aventura.",
];

export default dialogues_intro;
