import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DialogueBox from "../../components/DialogueBox/DialogueBox";
import intro3DDialogues from "../../data/dialogues/intro3D";
import "./Intro3D.css";

export default function Intro3D() {
  const [dialogStep, setDialogStep] = useState(0);
  const navigate = useNavigate();

  const currentDialogue = intro3DDialogues[dialogStep];
  const isLast = dialogStep === intro3DDialogues.length - 1;

  return (
    <div className="intro3d-container">
      <Canvas camera={{ position: [0, 2, 5] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls enablePan={false} enableZoom={false} />

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="#317eda" />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#aee0ff" />
        </mesh>
      </Canvas>

      <DialogueBox
        text={currentDialogue.text}
        onNext={() => {
          if (!isLast) setDialogStep(dialogStep + 1);
        }}
        showNext={!isLast}
      />

      {isLast && (
        <div className="dialogue-options">
          <button onClick={() => navigate("/world")}>Entrar como invitado</button>
          <button onClick={() => navigate("/auth")}>Guardar progreso</button>
        </div>
      )}
    </div>
  );
}
