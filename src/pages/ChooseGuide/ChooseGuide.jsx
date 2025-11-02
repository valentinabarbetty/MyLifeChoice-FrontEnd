import { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import DialogueBox from "../../components/DialogueBox/DialogueBox";
import "./ChooseGuide.css";
import dialoguesIntro from "../../data/dialogues/intro3D";
import TextInputBox from "../../components/TextInputBox/TextInputBox";

function PlaceholderScene({ showArrows }) {
  const group = useRef();
  const { scene } = useGLTF("/assets/models/guides/guy.glb");

  // 🔁 Movimiento suave del personaje
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      group.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.5) * 0.03 - 1.4;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 4, 3]} intensity={1.2} />

      {/* 🧍 Modelo 3D */}
      <group ref={group} position={[0, -1.4, 0]} scale={[1.7, 1.7, 1.7]}>
        <primitive object={scene} />
      </group>

      {/* 🎮 Imagen de flechas cuando toca moverse */}
      {showArrows && (
        <Html position={[2.5, 0.5, 0]} transform>
          <img
            src="/assets/ui/keyboard-arrows.png"
            alt="Flechas"
            className="canvas-arrows"
          />
        </Html>
      )}
    </>
  );
}

export default function ChooseGuide() {
  const [guide, setGuide] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const guides = [
    { id: "female", name: "Lili", color: "#ffb6c1", icon: "🌸" },
    { id: "male", name: "Nick", color: "#6ecb63", icon: "🌿" },
    { id: "neutral", name: "Andrew", color: "#a18cd1", icon: "🌈" },
  ];

  const handleSelect = (g) => {
    setGuide(g);
    localStorage.setItem("selectedGuide", g.name);
  };

  // 🧠 Genera los diálogos dinámicamente con nombre
  const dialogues = useMemo(() => dialoguesIntro(playerName), [playerName]);

  const handleNextDialogue = () => {
    // Evita avanzar sin nombre cuando toca ese diálogo
    if (dialogueIndex === 2 && playerName.trim() === "") {
      alert("Por favor, escribe tu nombre antes de continuar 😊");
      return;
    }

    // Avanza
    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex((prev) => prev + 1);
    } else {
      localStorage.setItem("playerName", playerName);
      alert(`🎮 ¡Comienza tu aventura, ${playerName || "amigue"}!`);
    }
  };

  return (
    <div className="choose-guide-container">
      {/* 🌈 Fondo antes de elegir guía */}
      {!guide && <div className="choose-guide-overlay" />}

      {/* 🧍 Selección de guía */}
      {!guide && (
        <div className="guide-selection">
          <h1 className="choose-title">Elige tu guía</h1>
          <div className="guide-options">
            {guides.map((g) => (
              <div
                key={g.id}
                className="guide-card"
                style={{ backgroundColor: g.color }}
                onClick={() => handleSelect(g)}
              >
                <span className="guide-icon">{g.icon}</span>
                <h3>{g.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🎥 Escena + Diálogo */}
      {guide && (
        <>
          <Canvas
            camera={{ position: [0, 0, 6], fov: 50 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 0,
            }}
          >
            <PlaceholderScene showArrows={dialogueIndex >= 4} />
          </Canvas>

          <div className="dialogue-container">
            {/* ✏️ Input visible solo cuando toca escribir el nombre */}
            {dialogueIndex === 2 && (
              <TextInputBox
                value={playerName}
                onChange={setPlayerName}
                onSubmit={handleNextDialogue}
                placeholder="Escribe tu nombre..."
              />
            )}

            <div className="dialogue-box-wrapper">
              <DialogueBox
                text={dialogues[dialogueIndex]}
                speaker={guide.name}
                onNext={handleNextDialogue}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
