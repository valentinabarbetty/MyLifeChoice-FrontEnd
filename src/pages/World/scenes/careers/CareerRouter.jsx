import AdministracionScene from "./administracion/AdministracionScene";
import ContaduriaScene from "./contaduria/ContaduriaScene";
import IngenieriaIndustrialScene from "./ingenieriaIndustrial/IngenieriaIndustrialScene";
import PsicologiaScene from "./psicologia/PsicologiaScene";
import SoftwareScene from "./software/SoftwareScene";


export default function CareerRouter({ careerId, mode, setMode, setDialogueIndex }) {
  switch (careerId) {
    case "administracion":
      return (
        <AdministracionScene
          mode={mode}
          setMode={setMode}
          setDialogueIndex={setDialogueIndex}
        />
      );

    case "contaduriaPublica":
      return (
        <ContaduriaScene
          mode={mode}
          setMode={setMode}
          setDialogueIndex={setDialogueIndex}
        />
      );
    case "ingenieriaIndustrial":
      return (
        <IngenieriaIndustrialScene
         mode={mode}
          setMode={setMode}
          setDialogueIndex={setDialogueIndex}
        />
      )
    case "psicologia":
      return (
        <PsicologiaScene
         mode={mode}
          setMode={setMode}
          setDialogueIndex={setDialogueIndex}
        />
      )
      case "software":
      return (
        <SoftwareScene
         mode={mode}
          setMode={setMode}
          setDialogueIndex={setDialogueIndex}
        />
      )

    default:
      return null;
  }
}