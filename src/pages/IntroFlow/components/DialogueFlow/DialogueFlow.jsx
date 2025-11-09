import { useState, useMemo } from "react";
import Scene3D from "../Scene3D/Scene3D";
import DialogueBox from "../../../../components/DialogueBox/DialogueBox";
import TextInputBox from "../../../../components/TextInputBox/TextInputBox";
import SessionStep from "../SessionStep/SessionStep";
import dialoguesIntro from "../../../../data/dialogues/intro3D";

export default function DialogueFlow({
  guide,
  playerName,
  onNameSet,
  onDialogueEnd,
}) {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const dialogues = useMemo(() => dialoguesIntro(playerName), [playerName]);

  const handleNext = () => {
    if (dialogueIndex === 3 && !playerName.trim()) {
      alert("Por favor, escribe tu nombre antes de continuar.");
      return;
    }

    if (dialogueIndex === 3 && playerName.trim()) {
      localStorage.setItem("playerName", playerName);
    }

    if (dialogueIndex >= dialogues.length - 1) {
      onDialogueEnd?.();
      return;
    }

    setDialogueIndex((prev) => prev + 1);
  };

  const handleSessionEnd = () => {
    setDialogueIndex((i) => i + 1);
  };

  return (
    <div className="dialogue-flow-container">
      <Scene3D showArrows={dialogueIndex === 7} />

      <div className="dialogue-container">
        {dialogueIndex === 3 && (
          <div className="input-wrapper">
            <TextInputBox
              value={playerName}
              onChange={onNameSet}
              onSubmit={handleNext}
              placeholder="Escribe tu nombre..."
            />
          </div>
        )}

        <div className="dialogue-box-wrapper" key={dialogues[dialogueIndex]}>
          <DialogueBox
            text={dialogues[dialogueIndex]}
            speaker={guide.name}
            onNext={handleNext}
            animateOnce={dialogueIndex === 0} // 💫 solo la primera vez
          />
        </div>

        {dialogueIndex === 5 && (
          <SessionStep
            guide={guide}
            playerName={playerName}
            onNext={handleSessionEnd}
          />
        )}
      </div>
    </div>
  );
}
