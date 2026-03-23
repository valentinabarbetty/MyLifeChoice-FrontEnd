import AdministracionGame from "./scenes/careers/administracion/AdministracionGame";
import AlimentosGame from "./scenes/careers/alimentos/AlimentosGame";
import ContaduriaGame from "./scenes/careers/contaduria/ContaduriaGame";
import EducacionFisicaGame from "./scenes/careers/educacionFisica/EducacionFisicaGame";
import ElectronicaGame from "./scenes/careers/electronica/ElectronicaGame";
import IngenieriaIndustrialGame from "./scenes/careers/ingenieriaIndustrial/IngenieriaIndustrialGame";
import LiteraturaGame from "./scenes/careers/literatura/LiteraturaGame";
import LogisticaGame from "./scenes/careers/logistica/LogisticaGame";
import MantenimientoGame from "./scenes/careers/mantenimiento/MantenimientoGame";
import PsicologiaGame from "./scenes/careers/psicologia/PsicologiaGame";
import SoftwareGame from "./scenes/careers/software/SoftwareGame";



export const GAME_COMPONENTS = {
  administracion: AdministracionGame,
  contaduriaPublica: ContaduriaGame,
  ingenieriaIndustrial: IngenieriaIndustrialGame,
  psicologia: PsicologiaGame,
  software: SoftwareGame,
  educacionFisica: EducacionFisicaGame,
  literatura: LiteraturaGame,
  alimentos: AlimentosGame,
  logistica: LogisticaGame,
  mantenimiento: MantenimientoGame,
  electronica: ElectronicaGame
};
