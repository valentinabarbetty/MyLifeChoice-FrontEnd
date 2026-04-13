import DialogueBox from "../../../../components/DialogueBox/DialogueBox";
import "./WorldHUD.css";
import { NPCS } from "../../data/npcsInfo";
import CareerFeedback from "../CareerFeedback/CareerFeedback";

export default function WorldHUD({
  scene,
  mode,
  dialogue,
  onNext,
  onAccept,
  onReject,
  activeCareer,
  activeNPC, // 🔥 IMPORTANTE
}) {

  // 🔥 CLAVE: usa el que exista
  const currentKey = activeCareer || activeNPC;
  const npc = currentKey ? NPCS[currentKey] : null;

  // 🎯 FEEDBACK
  if (scene === "CAREER" && mode === "career-feedback") {
    return <CareerFeedback career={activeCareer} onFinish={onAccept} />;
  }

  // 🎯 INTRO
  if (mode === "intro" && dialogue) {
    return (
      <DialogueBox
        speaker={dialogue.speaker}
        text={dialogue.text}
        onNext={onNext}
        showNext
      />
    );
  }

  // 🎯 INTERACCIÓN NPC
  if (mode === "interact") {
    return (
      <DialogueBox
        speaker={npc?.name || "Guía"}
        text={
          npc
            ? `Hola, soy ${npc.name}, ${npc.career}. ¿Quieres conocer mi carrera?`
            : "¿Deseas iniciar una conversación?"
        }
        showNext={false}
      >
        <div className="dgl-options">
          <button onClick={onAccept}>Sí</button>
          <button onClick={onReject}>No</button>
        </div>
      </DialogueBox>
    );
  }

  // 🎯 DIÁLOGOS NORMALES
  if ((mode === "dialogue" || mode === "career-ending") && dialogue) {
    return (
      <DialogueBox
        speaker={dialogue.speaker}
        text={dialogue.text}
        onNext={onNext}
        showNext={true}
      />
    );
  }

  // 🎯 JUEGO
  if (scene === "CAREER" && mode === "career-game") {
    return null;
  }

  return null;
}