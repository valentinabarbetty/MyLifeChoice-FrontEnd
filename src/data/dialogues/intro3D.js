const dialogues_intro = (playerName) => {
  const isLogged = localStorage.getItem("logged") === "logged";

  const baseDialogues = [
    "¡Hola! Me alegra conocerte.",
    "Soy tu guía en este viaje por My Life Choice.",
    "Aquí podrás explorar profesiones, descubrir tus intereses y aprender sobre ti mismo.",

    "¿Cuál es tu nombre?",
    playerName
      ? `¡Encantado de conocerte, ${playerName}!`
      : "¡Encantado de conocerte!",
  ];

  if (!isLogged) {
    baseDialogues.push(
      "Antes de continuar, ¿quieres que guarde tu progreso o prefieres jugar como invitado?",
      `Perfecto, ${playerName || "amigue"}`,
    );
  }

  baseDialogues.push(
    
    "Para moverte, usa las teclas W A S D.",
    "Da click personajes o casas para interactuar.",
    "Da clic en la flecha para comenzar tu aventura"
  );

  return baseDialogues;
};

export default dialogues_intro;
