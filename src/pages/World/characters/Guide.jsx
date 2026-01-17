import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export default function Guide({ position = [0, -3.5, 0], onInteract, lookAt }) {
  const guideRef = useRef();

  const selectedGuide = localStorage.getItem("selectedGuide");

  const getModelPath = () => {
    switch (selectedGuide) {
      case "1":
        return "/assets/models/guides/girl_guide_animated.glb";
      case "2":
        return "/assets/models/guides/guy_guide_animated.glb";
      case "3":
        return "/assets/models/guides/nb_guide_animated.fbx";
      default:
        return "/assets/models/guides/girl_guide_animated.glb";
    }
  };

  const { scene, animations } = useGLTF(getModelPath());
  const { actions } = useAnimations(animations, guideRef);
  useFrame(() => {
    if (lookAt && guideRef.current) {
      guideRef.current.lookAt(
        lookAt[0],
        guideRef.current.position.y,
        lookAt[2]
      );
    }
  });

  useEffect(() => {
    if (!actions) return;

    const idle =
      actions["idle"] || actions["idle"] || Object.values(actions)[0];

    idle?.reset().fadeIn(0.3).play();

    return () => idle?.fadeOut(0.3);
  }, [actions]);

  return (
    <primitive
      ref={guideRef}
      object={scene}
      position={position}
      scale={1}
      castShadow
      onClick={onInteract}
    />
  );
}
