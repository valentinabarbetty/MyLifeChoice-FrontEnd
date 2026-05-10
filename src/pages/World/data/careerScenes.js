import {
  administracionIntroDialogues,
  administracionEndingDialogues
} from "../scenes/careers/administracion/AdministracionDialogues";
import { agroambientalEndingDialogues, agroambientalIntroDialogues } from "../scenes/careers/agroambiental/AgroambientalDialogues";
import { agroforestalEndingDialogues, agroforestalIntroDialogues } from "../scenes/careers/agroforestal/AgroforestalDialogues";
import { alimentosEndingDialogues, alimentosIntroDialogues } from "../scenes/careers/alimentos/AlimentosDialogues";
import { contaduriaEndingDialogues, contaduriaIntroDialogues } from "../scenes/careers/contaduria/ContaduriaDialogues";
import { educacionFisicaEndingDialogues, educacionFisicaIntroDialogues } from "../scenes/careers/educacionFisica/educacionFisicaDialogues";
import { electronicaIndustrialEndingDialogues, electronicaIndustrialIntroDialogues } from "../scenes/careers/electronica/ElectronicaDialogues";
import { ingenieriaIndustrialEndingDialogues, ingenieriaIndustrialIntroDialogues } from "../scenes/careers/ingenieriaIndustrial/IngenieriaIndustrialDialogues";
import { literaturaEndingDialogues, literaturaIntroDialogues } from "../scenes/careers/literatura/LiteraturaDialogues";
import { logisticaEndingDialogues, logisticaIntroDialogues } from "../scenes/careers/logistica/LogisticaDialogues";
import { mantenimientoElectromecanicoEndingDialogues, mantenimientoElectromecanicoIntroDialogues } from "../scenes/careers/mantenimiento/MantenimientoDialogues";
import { psicologiaEndingDialogues, psicologiaIntroDialogues } from "../scenes/careers/psicologia/PsicologiaDialogues";
import { softwareEndingDialogues, softwareIntroDialogues } from "../scenes/careers/software/SoftwareDialogues";


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
  software: {
    intro: softwareIntroDialogues,
    ending: softwareEndingDialogues
  },
  educacionFisica: {
    intro: educacionFisicaIntroDialogues,
    ending: educacionFisicaEndingDialogues
  },
  literatura: {
    intro: literaturaIntroDialogues,
    ending: literaturaEndingDialogues
  },
  alimentos: {
    intro: alimentosIntroDialogues,
    ending: alimentosEndingDialogues
  },
  logistica: {
    intro: logisticaIntroDialogues,
    ending: logisticaEndingDialogues
  },
  mantenimiento: {
    intro: mantenimientoElectromecanicoIntroDialogues,
    ending: mantenimientoElectromecanicoEndingDialogues
  },
  electronica: {
    intro: electronicaIndustrialIntroDialogues,
    ending: electronicaIndustrialEndingDialogues
  },
  agroambiental: {
    intro: agroambientalIntroDialogues,
    ending: agroambientalEndingDialogues
  },
  agroforestal: {
    intro: agroforestalIntroDialogues,
    ending: agroforestalEndingDialogues
  },
};
