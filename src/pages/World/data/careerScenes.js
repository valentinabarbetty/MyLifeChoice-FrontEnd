// export const CAREER_SCENES = {
//   administracion: {
//     environment: "office",

//     npcs: {
//       manager: {
//         id: "manager",
//         model: "/assets/models/npc/administracion.glb",
//         position: [2, -3, 1],
//         route: [
//           [2, -3, 1],
//           [4, -3, 1],
//           [4, -3, 3],
//           [2, -3, 3],
//         ],
//       },
//     },

//     dialogues: {
//       manager: [
//         {
//           speaker: "manager",
//           text: "Bienvenido al departamento de Administración. Aquí es donde las ideas se convierten en planes reales.",
//           animation: "talking",
//         },
//         {
//           speaker: "manager",
//           text: "La administración se encarga de organizar personas, recursos y tiempo para que una empresa funcione correctamente.",
//           animation: "talking",
//         },
//         {
//           speaker: "manager",
//           text: "Un administrador analiza problemas, toma decisiones y coordina equipos para alcanzar objetivos.",
//           animation: "talking",
//         },
//         {
//           speaker: "manager",
//           text: "En esta carrera aprenderás sobre gestión financiera, talento humano, procesos y planificación estratégica.",
//           animation: "talking",
//         },
//         {
//           speaker: "manager",
//           text: "La administración es clave en empresas, organizaciones públicas, emprendimientos y proyectos sociales.",
//           animation: "talking",
//         },
//         {
//           speaker: "manager",
//           text: "Si te gusta liderar, organizar y buscar soluciones, esta carrera puede ser una excelente opción para ti.",
//           animation: "talking",
//         },
//       ],
//     },
//   },
// };
import {
  administracionIntroDialogues,
  administracionEndingDialogues
} from "../scenes/careers/administracion/AdministracionDialogues";
import { agroambientalDialogues } from "../scenes/careers/agroambiental/AgroambientalDialogues";
import { agroforestalDialogues } from "../scenes/careers/agroforestal/AgroforestalDialogues";
import { alimentosDialogues } from "../scenes/careers/alimentos/AlimentosDialogues";
import { contaduriaEndingDialogues, contaduriaIntroDialogues } from "../scenes/careers/contaduria/ContaduriaDialogues";
import { educacionFisicaDialogues } from "../scenes/careers/educacionFisica/educacionFisicaDialogues";
import { electronicaDialogues } from "../scenes/careers/electronica/ElectronicaDialogues";
import { ingenieriaIndustrialEndingDialogues, ingenieriaIndustrialIntroDialogues } from "../scenes/careers/ingenieriaIndustrial/IngenieriaIndustrialDialogues";
import { literaturaDialogues } from "../scenes/careers/literatura/LiteraturaDialogues";
import { logisticaDialogues } from "../scenes/careers/logistica/LogisticaDialogues";
import { mantenimientoDialogues } from "../scenes/careers/mantenimiento/MantenimientoDialogues";
import { psicologiaEndingDialogues, psicologiaIntroDialogues } from "../scenes/careers/psicologia/PsicologiaDialogues";
import { softwareDialogues } from "../scenes/careers/software/SoftwareDialogues";


export const CAREER_DIALOGUES = {
  administracion: {
    intro: administracionIntroDialogues,
    ending: administracionEndingDialogues,
  },
  contaduriaPublica: {
    intro: contaduriaIntroDialogues,
    ending: contaduriaEndingDialogues,
  },
  ingenieriaIndustrial: {
    intro: ingenieriaIndustrialIntroDialogues,
    ending: ingenieriaIndustrialEndingDialogues
  },
  psicologia: {
    intro: psicologiaIntroDialogues,
    ending: psicologiaEndingDialogues
  },

  software: softwareDialogues,
  educacionFisica: educacionFisicaDialogues,
  literatura: literaturaDialogues,
  agroambiental: agroambientalDialogues,
  alimentos: alimentosDialogues,
  electronica: electronicaDialogues,
  logistica: logisticaDialogues,
  agroforestal: agroforestalDialogues,
  mantenimiento: mantenimientoDialogues,
};
