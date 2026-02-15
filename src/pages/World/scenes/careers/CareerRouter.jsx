import AdministracionScene from "./administracion/AdministracionScene";
import PsicologiaScene from "./psicologia/PsicologiaScene";
import SoftwareScene from "./software/SoftwareScene";

export default function CareerRouter({ careerId }) {
  switch (careerId) {
    case "administracion":
      return <AdministracionScene />;
    case "psicologia":
      return <PsicologiaScene />;
    case "software":
      return <SoftwareScene />;
    default:
      return null;
  }
}
