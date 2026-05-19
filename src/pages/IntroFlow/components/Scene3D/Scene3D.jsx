import React, { use, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useGLTF, useAnimations } from "@react-three/drei";

const GUIDE_MODELS = {
  1: "/assets/models/guides/girl_guide_animated.glb",
  2: "/assets/models/guides/guy_guide_animated.glb",
  3: "/assets/models/guides/nb_guide_animated.glb",
};

function GuideModel({ guideId, showArrows, animationState }) {
  const group = useRef();
  const modelPath = GUIDE_MODELS[guideId] || GUIDE_MODELS[1];
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);
  const baseY = -3;
  const currentAction = useRef(null);

  useEffect(() => {
    if (!actions) return;

    let nextAction;

    switch (animationState) {
      case "greet":
        nextAction = actions.greet;
        break;
      case "walking":
        nextAction = actions.waling;
        break;
      case "idle":
        nextAction = actions.idle;
        break;
      case "victory":
        nextAction = actions.victory;
        break;
      default:
        nextAction = actions.idle;
    }

    if (!nextAction) return;

    if (currentAction.current && currentAction.current !== nextAction) {
      currentAction.current.fadeOut(0.3);
    }

    nextAction.reset().fadeIn(0.3).play();

    currentAction.current = nextAction;
  }, [animationState, actions, guideId]);

  useFrame((state) => {
    if (!group.current) return;

    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;

    group.current.position.y =
      baseY + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 4, 3]} intensity={1.2} />

      <group ref={group} position={[0, -1.4, 2]} scale={[1.7, 1.7, 1.7]}>
        <primitive object={scene} />
      </group>

      {showArrows && (
        <Html position={[2.5, 0.5, 0]} transform>
          <img
            src="/assets/ui/keyboard-arrows.png"
            alt="Flechas"
            style={{
              width: "80px",
              height: "auto",
              opacity: 0.9,
            }}
          />
        </Html>
      )}
    </>
  );
}

export default function Scene3D({ guideId, showArrows, animationState }) {
  console.log(
    "Rendering Scene3D with guideId:",
    guideId,
    "and showArrows:",
    showArrows
  );
  if (!guideId) return null;
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "80vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <GuideModel
        guideId={guideId.id}
        showArrows={showArrows}
        animationState={animationState}
      />
    </Canvas>
  );
}
