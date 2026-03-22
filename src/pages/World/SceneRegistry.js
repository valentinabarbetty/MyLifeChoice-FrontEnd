// SceneRegistry.js

import AdministracionScene from "./scenes/careers/administracion/AdministracionScene";
import ContaduriaScene from "./scenes/careers/contaduria/ContaduriaScene";
import IngenieriaIndustrialScene from "./scenes/careers/ingenieriaIndustrial/IngenieriaIndustrialScene";
import PsicologiaScene from "./scenes/careers/psicologia/PsicologiaScene"
import SoftwareScene from "./scenes/careers/software/SoftwareScene";
import EducacionFisicaScene from "./scenes/careers/educacionFisica/EducacionFisicaScene";

export const SCENE_COMPONENTS = {
  administracion: AdministracionScene,
  contaduriaPublica: ContaduriaScene,
  ingenieriaIndustrial: IngenieriaIndustrialScene,
  psicologia: PsicologiaScene,
  software: SoftwareScene,
  educacionFisica: EducacionFisicaScene
};