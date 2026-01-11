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
    speaker: "Raquelle",
    text: "Bienvenida. Soy el gerente de esta empresa.",
    animation: "talking",
  },
  {
    speaker: "Raquelle",
    text: "En Administración de Empresas tomamos decisiones para que una organización funcione.",
    animation: "talking",
  },
  {
    speaker: "Raquelle",
    text: "¿Quieres conocer más sobre Administración de Empresas?",
    animation: "thinking",
  },
];
