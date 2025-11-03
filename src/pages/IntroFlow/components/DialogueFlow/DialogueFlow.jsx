import { useState, useMemo } from "react";
import Scene3D from "../Scene3D/Scene3D";
import DialogueBox from "../../../../components/DialogueBox/DialogueBox";
import TextInputBox from "../../../../components/TextInputBox/TextInputBox";
import SessionStep from "../SessionStep/SessionStep"; // 👈 aquí sí lo usamos DENTRO del flujo
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

    // si llega al último diálogo
    if (dialogueIndex >= dialogues.length - 1) {
      onDialogueEnd?.();
      return;
    }

    setDialogueIndex((prev) => prev + 1);
  };

  // ⚡ callback para avanzar tras autenticarse o continuar como invitado
  const handleSessionEnd = () => {
    setDialogueIndex((i) => i + 1);
  };

  return (
    <div className="dialogue-flow-container">
      {/* 🎬 Canvas 3D */}
      <Scene3D showArrows={dialogueIndex === 7} />

      <div className="dialogue-container">
        {/* 🟡 Input de nombre */}
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

        {/* 💬 Globo del diálogo SIEMPRE visible */}
        <div className="dialogue-box-wrapper">
          <DialogueBox
            text={dialogues[dialogueIndex]}
            speaker={guide.name}
            onNext={handleNext}
          />
        </div>

        {/* 🔐 Aquí se integran las opciones de sesión SIN ocultar el diálogo */}
        {dialogueIndex === 5 && (
          <div className="input-wrapper" style={{ marginTop: "-180px" }}>
            <SessionStep
              guide={guide}
              playerName={playerName}
              onNext={handleSessionEnd}
            />
          </div>
        )}
      </div>
    </div>
  );
}
