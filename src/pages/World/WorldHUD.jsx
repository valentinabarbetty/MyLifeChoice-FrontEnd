import DialogueBox from "../../components/DialogueBox/DialogueBox";


export default function WorldHUD({
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
        speker="?"
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
  if (mode === "dialogue" && dialogue)
    return (
      <DialogueBox
        text={dialogue.text}
        speaker={dialogue.speaker}
        onNext={onNext}
        showNext={true}
      />
    );


}
