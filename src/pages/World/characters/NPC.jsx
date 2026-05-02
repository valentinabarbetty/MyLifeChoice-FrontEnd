import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";

export default function NPC({
  modelPath,
  route,
  lookAt,
  isNear,
  animationState,
  onInteract,
  onMove,
  scale = 1,
}) {
  const ref = useRef();
  const rb = useRef();

  const animationMap = {
    talking: "talking",
    walking: "walk",
    walk: "walk",
    idle: "idle",
    explain: "talking",
    soft: "idle",
    thinking: "idle",
  };

  const { scene, animations } = useGLTF(modelPath);
  const hasRoute = Array.isArray(route) && route.length > 0;
  const { actions } = useAnimations(animations, ref);
  const currentAction = useRef(null);
  const targetIndex = useRef(0);
  const speed = 0.4;
  const lastUpdate = useRef(0);

  // Inicializar animación
  useEffect(() => {
    if (!actions) return;
    const first =
      actions["idle"] || actions["walk"] || Object.values(actions)[0];
    if (!first) return;
    first.reset().fadeIn(0.3).play();
    currentAction.current = first;
  }, [actions]);

  // Cambiar animación según estado
  useEffect(() => {
    if (!actions) return;
    const keys = Object.keys(actions);
    const mapped = animationMap[animationState] || animationState;
    const match = keys.find((k) => k.toLowerCase() === mapped?.toLowerCase());
    const next = match
      ? actions[match]
      : actions["idle"] || Object.values(actions)[0];
    if (!next || currentAction.current === next) return;
    if (currentAction.current) currentAction.current.fadeOut(0.2);
    next.reset().fadeIn(0.2).play();
    currentAction.current = next;
  }, [animationState, actions]);

  // Posición inicial
  useEffect(() => {
    if (!rb.current || !hasRoute) return;
    const start = route[0];
    console.log(`NPC ${modelPath} spawn en:`, start);
    rb.current.setTranslation(
      {
        x: start[0],
        y: start[1],
        z: start[2],
      },
      true,
    );
  }, [hasRoute, route, modelPath]);

  useFrame((_, delta) => {
    if (!rb.current || !ref.current || !hasRoute) return;

    // Si está en interacción, solo mirar
    if (isNear && lookAt) {
      const pos = rb.current.translation();
      // Método 1: Usar posición con misma Y
      const dx = lookAt.x - pos.x;
      const dz = lookAt.z - pos.z;

      const angle = Math.atan2(dx, dz);

      ref.current.rotation.y = angle;
      return;
    }

    const target = route[targetIndex.current];
    const targetVec = new THREE.Vector3(target[0], target[1], target[2]);
    const currentPos = rb.current.translation();
    const pos = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z);

    const dir = targetVec.clone().sub(pos);
    const dist = dir.length();

    if (dist < 0.3) {
      targetIndex.current = (targetIndex.current + 1) % route.length;
      return;
    }

    // Movimiento
    dir.normalize();
    const newPos = pos.clone().add(dir.multiplyScalar(speed * delta));
    newPos.y = target[1];

    rb.current.setTranslation(newPos, true);

    // Rotación para caminar (solo en Y)
    const angle = Math.atan2(dir.x, dir.z);
    ref.current.rotation.y = angle;

    const now = Date.now();
    if (now - lastUpdate.current > 200) {
      onMove?.(newPos.clone());
      lastUpdate.current = now;
    }
  });

  return (
    <RigidBody
      ref={rb}
      type="kinematicPosition"
      colliders={false}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[0.4, 0.8]} sensor />
      <group ref={ref} onClick={onInteract} position={[0, -0.5, 0]}>
        <primitive object={scene} scale={[scale, scale, scale]} />
      </group>
    </RigidBody>
  );
}
