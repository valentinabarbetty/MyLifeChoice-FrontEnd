import DialogueBox from "../../../../components/DialogueBox/DialogueBox";
import "./WorldHUD.css";
import { NPCS } from "../../data/npcsInfo";
export default function WorldHUD({
  scene,
  mode,
  dialogue,
  onNext,
  onAccept,
  onReject,
  activeNPC,
}) {
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

  if (mode === "interact") {
    const npcData = NPCS[activeNPC];

    return (
      <DialogueBox
        speaker={npcData?.name || "NPC"}
        text={`Hola 👋, soy ${npcData?.name}, ${npcData?.career}.
          ¿Deseas conocer más sobre lo que hago?`}
        showNext={false}
      >
        <div className="dgl-options">
          <button onClick={onAccept}>Sí</button>
          <button onClick={onReject}>No</button>
        </div>
      </DialogueBox>
    );
  }

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

  if (scene === "CAREER" && mode === "career-feedback") {
  const npcData = NPCS[activeNPC];


  return (
    <DialogueBox
      speaker={npcData?.name || "NPC"}
      text={`¿Te ha gustado la carrera de ${npcData?.career_name}?`}
      showNext={false}
    >
      <div className="dgl-options">
        <button onClick={onAccept}>Sí</button>
        <button onClick={onReject}>No</button>
      </div>
    </DialogueBox>
  );
}
  if (scene === "CAREER" && mode === "career-game") {
    return null;
  }

  return null;
}
