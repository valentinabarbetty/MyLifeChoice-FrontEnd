// import { useGLTF, useAnimations } from "@react-three/drei";
// import { useEffect, useRef } from "react";
// import { useFrame } from "@react-three/fiber";
// import * as THREE from "three";
// import { CapsuleCollider, RigidBody } from "@react-three/rapier";

// export default function NPC({
//   modelPath,
//   route,
//   lookAt,
//   isNear,
//   animationState,
//   onInteract,
//   onMove,
// }) {
//   const ref = useRef();
//   const rb = useRef();
//   const lastUpdate = useRef(0);

//   const { scene, animations } = useGLTF(modelPath);
//   const hasRoute = Array.isArray(route) && route.length > 0;

//   const { actions } = useAnimations(animations, ref);
//   const currentAction = useRef(null);

//   const targetIndex = useRef(0);
//   const speed = 0.015;

//   // 🎬 Animación inicial
//   useEffect(() => {
//     if (!actions) return;

//     const start = actions[animationState] || Object.values(actions)[0];
//     start.reset().fadeIn(0.3).play();
//     currentAction.current = animationState;
//   }, [actions, animationState]);

//   // 🔄 Cambio de animación
//   useEffect(() => {
//     if (!actions || !animationState) return;
//     if (currentAction.current === animationState) return;

//     actions[currentAction.current]?.fadeOut(0.2);
//     const next = actions[animationState] || Object.values(actions)[0];
//     next?.reset().fadeIn(0.2).play();

//     currentAction.current = animationState;
//   }, [animationState, actions]);

//   // 📍 Posición inicial
//   useEffect(() => {
//     if (!rb.current || !hasRoute) return;

//     const start = route[0];

//     rb.current.setNextKinematicTranslation({
//       x: start[0],
//       y: start[1],
//       z: start[2],
//     });
//   }, [hasRoute, route]);

//   useFrame(() => {
//   if (!rb.current || !ref.current || !hasRoute) return;

//   const t = rb.current.translation();

//   const pos = new THREE.Vector3(t.x, t.y, t.z);

//   // 🔥 DETENER en interacción
//   if (isNear) {
//     if (lookAt) {
//       ref.current.lookAt(lookAt.x, pos.y, lookAt.z);
//     }
//     return;
//   }

//   const target = route[targetIndex.current];
//   const targetVec = new THREE.Vector3(target[0], target[1], target[2]);

//   const dir = targetVec.clone().sub(pos);
//   const dist = dir.length();

//   if (dist < 0.05) {
//     targetIndex.current = (targetIndex.current + 1) % route.length;
//     return;
//   }

//   dir.normalize();

//   const newPos = pos.clone().add(dir.multiplyScalar(speed));

//   rb.current.setNextKinematicTranslation(newPos);

//   // 🔥 IMPORTANTE: actualizar mesh visual
//   ref.current.position.copy(newPos);

//   ref.current.lookAt(targetVec.x, newPos.y, targetVec.z);

//   const now = Date.now();
//   if (now - lastUpdate.current > 200) {
//     onMove?.(newPos.clone());
//     lastUpdate.current = now;
//   }
// });

//   return (
//     <RigidBody
//       ref={rb}
//       type="kinematicPosition"
//       colliders={false}
//       enabledRotations={[false, false, false]}
//     >
//       <CapsuleCollider args={[0.35, 0.35]} sensor />

//       <group ref={ref} onClick={onInteract}>
//         <primitive object={scene} />
//       </group>
//     </RigidBody>
//   );
// }

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
}) {
  
  const ref = useRef();
  const animationMap = {
    talking: "talking",
    talking2: "talking2",
    walking: "walk", 
    walk: "walk",
    idle: "idle",

    explain: "talking",
    soft: "idle",
    thinking: "idle",
    smile: "clap",
    wave: "clap",
  };

  const { scene, animations } = useGLTF(modelPath);
  const hasRoute = Array.isArray(route) && route.length > 0;

  const { actions } = useAnimations(animations, ref);
  const rb = useRef();

  // useEffect(() => {
  //   if (!actions) return;

  //   const start = actions[animationState] || Object.values(actions)[0];
  //   start.reset().fadeIn(0.3).play();
  //   currentAction.current = animationState;
  // }, [actions]);

  const currentAction = useRef(null);

  const targetIndex = useRef(0);
  const speed = 0.015;
useEffect(() => {
  if (!actions) return;

  const first = actions["idle"] || Object.values(actions)[0];
  if (!first) return;

  first.reset().fadeIn(0.3).play();
  currentAction.current = first;


}, [actions]);
  useFrame(() => {
    if (!ref.current || !rb.current || !hasRoute) return;

    if (isNear && lookAt) {
      const pos = rb.current.translation();

      ref.current.lookAt(lookAt.x, pos.y, lookAt.z);

      return;
    }
    const target = route[targetIndex.current];
    const targetVec = new THREE.Vector3(target[0], target[1], target[2]);

    const t = rb.current.translation();
    const pos = new THREE.Vector3(t.x, t.y, t.z);

    const dir = targetVec.clone().sub(pos);
    const dist = dir.length();

    if (dist < 0.05) {
      targetIndex.current = (targetIndex.current + 1) % route.length;
      return;
    }

    dir.normalize();
    const newPos = pos.clone().add(dir.multiplyScalar(speed));

    newPos.y = route[0][1];

    rb.current.setNextKinematicTranslation({
      x: newPos.x,
      y: newPos.y,
      z: newPos.z,
    });

    ref.current.lookAt(targetVec.x, newPos.y, targetVec.z);

    onMove?.(newPos.clone());
  });
  useEffect(() => {
    if (!actions) return;

   
  }, [actions]);
  useEffect(() => {
    if (!actions) return;

   

    const keys = Object.keys(actions);

    const mapped = animationMap[animationState] || animationState;

    const match = keys.find((k) => k.toLowerCase() === mapped?.toLowerCase());

    const next = match ? actions[match] : actions["idle"];

   

    if (!next) return;

  
    if (currentAction.current === next) return;

    if (currentAction.current) {
      currentAction.current.fadeOut(0.2);
    }

  
    next.reset().fadeIn(0.2).play();


    currentAction.current = next;
  }, [animationState, actions]);
  return (
    <RigidBody
      ref={rb}
      type="kinematicPosition"
      colliders={false}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[0.35, 0.5]} />

      <group ref={ref} onClick={onInteract}>
        <primitive ref={ref} object={scene} onClick={onInteract} />
      </group>
    </RigidBody>
  );
}
