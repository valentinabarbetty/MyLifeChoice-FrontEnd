import AdministracionScene from "./administracion/AdministracionScene";
import AgroambienalScene from "./agroambiental/AgroambienalScene";
import AgroforestalScene from "./agroforestal/AgroforestalScene";
import AlimentosScene from "./alimentos/AlimentosScene";
import ContaduriaScene from "./contaduria/ContaduriaScene";
import EducacionFisicaScene from "./educacionFisica/EducacionFisicaScene";
import ElectronicaScene from "./electronica/ElectronicaScene.jsx";
import IngenieriaIndustrialScene from "./ingenieriaIndustrial/IngenieriaIndustrialScene";
import LiteraturaScene from "./literatura/LiteraturaScene";
import LogisticaScene from "./logistica/LogisticaScene";
import MantenimientoScene from "./mantenimiento/MantenimientoScene";
import PsicologiaScene from "./psicologia/PsicologiaScene";
import SoftwareScene from "./software/SoftwareScene";

export default function CareerRouter({ careerId }) {
  switch (careerId) {
    case "administracion":
      return <AdministracionScene />;
    case "agroambiental":
        return <AdministracionScene />;
    case "agroforestal":
        return <AgroforestalScene />;
    case "alimentos":
        return <AlimentosScene />;
    case "contaduria":
        return <ContaduriaScene />;
    case "educacionFisica":
        return <EducacionFisicaScene />;
    case "electronica":
        return <ElectronicaScene />;
    case "ingenieriaIndustrial":
        return <IngenieriaIndustrialScene />;
    case "literatura":
        return <LiteraturaScene />;
    case "logistica":
        return <LogisticaScene />;
    case "mantenimiento":
        return <MantenimientoScene />;
    case "psicologia":
      return <PsicologiaScene />;
    case "software":
      return <SoftwareScene />;
    default:
      return null;
  }
}
