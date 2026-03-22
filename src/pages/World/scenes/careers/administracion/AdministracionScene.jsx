import BaseCareerScene from "../BaseCareerScene";
import AdministracionGame from "./AdministracionGame";

export default function AdministracionScene({ mode, setMode, setDialogueIndex }) {
  return (
    <BaseCareerScene careerId="administracion">
      {/* {mode === "career-game" && (
        <AdministracionGame
          onComplete={() => {
            setDialogueIndex(0);
            setMode("career-ending");
          }}
        />
      )} */}
    </BaseCareerScene>
  );
}