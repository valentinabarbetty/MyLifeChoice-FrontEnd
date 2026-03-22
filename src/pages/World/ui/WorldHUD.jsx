import DialogueBox from "../../../components/DialogueBox/DialogueBox"


export default function WorldHUD({
  scene,
  mode,
  dialogue,
  onNext,
  onAccept,
  onReject,
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
    return (
      <DialogueBox
        speaker="?"
        text="¿Deseas iniciar una conversación?"
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
  return (
    <DialogueBox
      speaker="manager"
      text="¿Te ha gustado la carrera de Administración?"
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
