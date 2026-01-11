import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function NPC({
  modelPath,
  route,
  lookAt,
  isNear,
  animationState,
  onInteract,
  onMove,
}) {
  const ref = useRef();

  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, ref);
  const currentAction = useRef(null);

  const targetIndex = useRef(0);
  const speed = 0.015;

  // Colocar en el primer punto del cuadrado
  useEffect(() => {
    if (!ref.current || !route) return;
    ref.current.position.set(route[0][0], route[0][1], route[0][2]);
  }, [route]);

  // Animaciones
  useEffect(() => {
    if (!actions || !animationState) return;

    if (currentAction.current === animationState) return;

    actions[currentAction.current]?.fadeOut(0.2);
    const next = actions[animationState] || Object.values(actions)[0];
    next?.reset().fadeIn(0.2).play();
    currentAction.current = animationState;
  }, [animationState, actions]);

  useFrame(() => {
    if (!ref.current || !route) return;

    // 🛑 Si el jugador está cerca → no camina
    if (isNear) {
      if (lookAt) {
        ref.current.lookAt(lookAt.x, ref.current.position.y, lookAt.z);
      }
      return;
    }

    const target = route[targetIndex.current];
    const targetVec = new THREE.Vector3(target[0], target[1], target[2]);
    const pos = ref.current.position;

    const dir = targetVec.clone().sub(pos);
    const dist = dir.length();

    if (dist < 0.05) {
      targetIndex.current = (targetIndex.current + 1) % route.length;
      return;
    }

    dir.normalize();
    pos.add(dir.multiplyScalar(speed));
    ref.current.lookAt(targetVec.x, pos.y, targetVec.z);
    onMove?.(ref.current.position.clone());
  });

  return (
    <group ref={ref} onClick={onInteract}>
      <primitive object={scene} />
    </group>
  );
}
