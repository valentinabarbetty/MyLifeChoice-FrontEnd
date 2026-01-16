export const CAREER_SCENES = {
  administracion: {
    environment: "office",

    npcs: {
      manager: {
        id: "manager",
        model: "/assets/models/npc/administracion.glb",
        position: [2, -3, 1],
        route: [
          [2, -3, 1],
          [4, -3, 1],
          [4, -3, 3],
          [2, -3, 3],
        ],
      },
    },

    dialogues: {
      manager: [
        {
          speaker: "manager",
          text: "Bienvenido al departamento de administración...",
          animation: "talking",
        },
      ],
    },
  },
};
