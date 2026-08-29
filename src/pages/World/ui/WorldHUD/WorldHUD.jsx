import DialogueBox from "../../../../components/DialogueBox/DialogueBox";
import "./WorldHUD.css";
import { NPCS } from "../../data/npcsInfo";
import CareerFeedback from "../CareerFeedback/CareerFeedback";
import { useEffect } from "react";

const estimateReadMs = (message, minMs = 900) =>
  Math.max(minMs, message.split(/\s+/).length * 150);

function ConfirmDialog({ speaker, text, onAccept, onReject, announce, dialogKey }) {
  const yesInstructions =
    "Estás en el botón Sí. Presiona Enter para explorar esta carrera. " +
    "Presiona Tab para ir al botón No.";

  const noInstructions =
    "Estás en el botón No. Presiona Enter para no explorar esta carrera y volver al mundo. " +
    "Presiona Tab para regresar al botón Sí.";

  return (
    <DialogueBox
      speaker={speaker}
      text={text}
      showNext={false}
      extraHint="Presiona Tab para ir a las opciones de respuesta."
    >
      <div
        className="dgl-options"
        role="group"
        aria-label="Opciones de respuesta"
      >
        <button
          onClick={onAccept}
          onFocus={() =>
            announce?.(yesInstructions, estimateReadMs(yesInstructions))
          }
          className="option-btn option-yes"
          aria-label={yesInstructions}
        >
          Sí
        </button>
        <button
          onClick={onReject}
          onFocus={() =>
            announce?.(noInstructions, estimateReadMs(noInstructions))
          }
          className="option-btn option-no"
          aria-label={noInstructions}
        >
          No
        </button>
      </div>
    </DialogueBox>
  );
}

export default function WorldHUD({
  scene,
  mode,
  dialogue,
  onNext,
  onAccept,
  onReject,
  activeCareer,
  activeNPC,
  announce,
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
      <ConfirmDialog
        dialogKey={`interact-${currentKey}`}
        speaker={npcName}
        text={dialogueText}
        onAccept={onAccept}
        onReject={onReject}
        announce={announce}
      />
    );
  }

  if (mode === "house-interact") {
    const careerName = npc?.career_name || currentKey;

    return (
      <ConfirmDialog
        dialogKey={`house-interact-${currentKey}`}
        speaker={careerName}
        text={`¿Quieres explorar ${careerName}?`}
        onAccept={onAccept}
        onReject={onReject}
        announce={announce}
      />
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