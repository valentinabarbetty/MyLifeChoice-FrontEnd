import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";

function GuideModel({ showArrows }) {
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

export default function Scene3D({ showArrows }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <GuideModel showArrows={showArrows} />
    </Canvas>
  );
}
