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
  activeNPC,
}) {

  const currentKey = activeCareer || activeNPC;
  const npc = currentKey ? NPCS[currentKey] : null;


  if (scene === "CAREER" && mode === "career-feedback") {
    return (
      <div
        role="region"
        aria-label="Retroalimentación de carrera"
        aria-live="polite"
      >
        <CareerFeedback career={activeCareer} onFinish={onAccept} />
      </div>
    );
  }

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
    const npcName = npc?.name || "Guía";
    const npcCareer = npc?.career || "";
    const dialogueText = npc
      ? `Hola, soy ${npcName}, ${npcCareer}. ¿Quieres conocer mi carrera?`
      : "¿Deseas iniciar una conversación?";

    return (
   
        <DialogueBox
          speaker={npcName}
          text={dialogueText}
          showNext={false}
        >
          <div className="dgl-options" role="group" aria-label="Opciones de respuesta">
            <button
              onClick={onAccept}
              className="option-btn option-yes"
              aria-label="Sí, quiero conocer esta carrera"
            >
              Sí
            </button>
            <button
              onClick={onReject}
              className="option-btn option-no"
              aria-label="No, no quiero conocer esta carrera ahora"
            >
              No
            </button>
          </div>
        </DialogueBox>
  
    );
  }
  if (mode === "house-interact") {
  const careerName = npc?.career_name || currentKey;

  return (
    <DialogueBox
      speaker={careerName}  
      text={`¿Quieres explorar ${careerName}?`}
      showNext={false}
    >
      <div className="dgl-options" role="group" aria-label="Opciones de respuesta">
        <button onClick={onAccept} className="option-btn option-yes">Sí</button>
        <button onClick={onReject} className="option-btn option-no">No</button>
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

  if (scene === "CAREER" && mode === "career-game") {
    return null;
  }

  return null;
}