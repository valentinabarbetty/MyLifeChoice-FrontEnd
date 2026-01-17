const dialogues_intro = (playerName) => {
  const isLogged = localStorage.getItem("logged") === "logged";

  const baseDialogues = [
    // Etapa 1: Bienvenida
    "¡Hola! Me alegra conocerte.",
    "Soy tu guía en este viaje por My Life Choice.",
    "Aquí podrás explorar profesiones, descubrir tus intereses y aprender sobre ti mismo.",

    // Etapa 2: Nombre
    "¿Cuál es tu nombre?",
    playerName
      ? `¡Encantado de conocerte, ${playerName}!`
      : "¡Encantado de conocerte!",
  ];

  // 👇 Solo agregar el diálogo de sesión si no está loggeado
  if (!isLogged) {
    baseDialogues.push(
      "Antes de continuar, ¿quieres que guarde tu progreso o prefieres jugar como invitado?",
      `Perfecto, ${playerName || "amigue"}`,
    );
  }

  // Etapa 4: Instrucciones
  baseDialogues.push(
    
    "Para moverte, usa las flechas ← ↑ ↓ → o las teclas W A S D.",
    "Presiona ENTER para interactuar con personajes u objetos.",
    "Da clic en la flecha para comenzar tu aventura"
  );

  return baseDialogues;
};

export default dialogues_intro;
