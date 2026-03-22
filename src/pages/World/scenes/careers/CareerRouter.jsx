import AdministracionScene from "./administracion/AdministracionScene";
import ContaduriaScene from "./contaduria/ContaduriaScene";
import IngenieriaIndustrialScene from "./ingenieriaIndustrial/IngenieriaIndustrialScene";


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

    default:
      return null;
  }
}