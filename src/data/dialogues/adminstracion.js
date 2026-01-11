export const ADMIN_NPCS = {
  manager: {
    id: "manager",
    model: "/assets/models/npc/administracion.glb",
    // cuadrado de 6x6 metros
    route: [
      [0, -3, 0],
      [6, -3, 0],
      [6, -3, 6],
      [0, -3, 6],
    ],
  },
};


export const ADMIN_DIALOGUE = [
  {
    speaker: "Administrador",
    text: "Bienvenida. Soy el gerente de esta empresa.",
    animation: "talking",
  },
  {
    speaker: "Administrador",
    text: "En Administración de Empresas tomamos decisiones para que una organización funcione.",
    animation: "talking",
  },
  {
    speaker: "Administrador",
    text: "¿Quieres intentar organizar un pequeño proyecto?",
    animation: "thinking",
  },
];
