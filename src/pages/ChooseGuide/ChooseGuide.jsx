import { useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import DialogueBox from "../../components/DialogueBox/DialogueBox";
import TextInputBox from "../../components/TextInputBox/TextInputBox";
import SessionChoice from "../../components/SessionChoice/SessionChoice";
import dialoguesIntro from "../../data/dialogues/intro3D";
import "./ChooseGuide.css";
import AuthModal from "../../components/AuthModal/AuthModal";

//// ESCEMA
function PlaceholderScene({ showArrows }) {
  const group = useRef();
  const { scene } = useGLTF("/assets/models/guides/guy.glb");

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
      <group ref={group} position={[0, -1.4, 0]} scale={[1.7, 1.7, 1.7]}>
        <primitive object={scene} />
      </group>

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
  const [sessionType, setSessionType] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // ✅ nuevo estado

  const guides = [
    { id: "female", name: "Lili", color: "#ffb6c1", icon: "🌸" },
    { id: "male", name: "Nick", color: "#6ecb63", icon: "🌿" },
    { id: "neutral", name: "Andrew", color: "#a18cd1", icon: "🌈" },
  ];

  const handleSelect = (g) => {
    setGuide(g);
    localStorage.setItem("selectedGuide", g.name);
  };

  const dialogues = useMemo(() => dialoguesIntro(playerName), [playerName]);

  const handleNextDialogue = () => {
    if (dialogueIndex === 3 && playerName.trim() === "") {
      alert("Por favor, escribe tu nombre antes de continuar");
      return;
    }

    if (dialogueIndex === 3 && playerName.trim() !== "") {
      localStorage.setItem("playerName", playerName);
    }
    console.log(dialogueIndex)
    if (dialogueIndex === 5 && sessionType === "auth") {
      setShowAuthModal(true);
      return;
    }
    console.log("Ingresó", dialogueIndex, sessionType);
    if (dialogueIndex === 6 && sessionType === "auth") {
      if (localStorage.getItem("logged") === "logged") {
        setShowAuthModal(false);
        setDialogueIndex(dialogueIndex + 1);
        return;
      }
    }

    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex((prev) => prev + 1);
    } else {
      localStorage.setItem("playerName", playerName);
      localStorage.setItem("sessionType", sessionType || "guest");
    }
  };

  const funcPrueba = () => {
    setDialogueIndex(dialogueIndex + 1);
  }
  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        setShowAuthModal(false); // cierra el modal
        localStorage.setItem("logged", "logged"); // avanza automáticamente
      }, 100); // 100ms suele ser suficiente
    }
  }, [isAuthenticated]);

  return (
    <div className="choose-guide-container">
      {!guide && <div className="choose-guide-overlay" />}

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

      {/* ✅ Escena y diálogos */}
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
            <PlaceholderScene showArrows={dialogueIndex === 7} />
          </Canvas>

          <div className="dialogue-container">
            {dialogueIndex === 3 && (
              <div className="input-wrapper">
                <TextInputBox
                  value={playerName}
                  onChange={setPlayerName}
                  onSubmit={handleNextDialogue}
                  placeholder="Escribe tu nombre..."
                />
              </div>
            )}

            {dialogueIndex === 5 && (
              <div className="input-wrapper">
                <SessionChoice
                  onSelect={(type) => {
                    setSessionType(type);
                    localStorage.setItem("sessionType", type);

                    if (type === "guest") {
                      handleNextDialogue(); // avanza directo
                    } else if (type === "auth") {
                      setShowAuthModal(true); // abre modal
                    }
                  }}
                />
              </div>
            )}

            {showAuthModal && (
              <AuthModal
                onClose={() => setShowAuthModal(false)}
                onLoginSuccess={(userData) => {
                  if (userData?.nickname) {
                    localStorage.setItem("playerName", userData.nickname);
                  } else if (userData?.email) {
                    const nameFromEmail = userData.email.split("@")[0];
                    localStorage.setItem("playerName", nameFromEmail);
                  }
                  localStorage.setItem("sessionType", "auth");
                  setIsAuthenticated(true);
                }}
                onNext={handleNextDialogue}
                prueba={funcPrueba}
              />
            )}

            {/* ✅ Globo de diálogo */}
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
