// import { useGLTF, useAnimations } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
// import {
//   RigidBody,
//   CapsuleCollider,
//   interactionGroups,
// } from "@react-three/rapier";
// import { useEffect, useMemo, useRef, useState } from "react";
// import * as THREE from "three";

// export default function Player({ onMove, mode, spawnPosition }) {
//   const rb = useRef();
//   const modelRef = useRef();

//   const [isMoving, setIsMoving] = useState(false);
//   const currentAction = useRef(null);
//   const wasMoving = useRef(false);
//   const direction = useRef(0);

//   const keys = useRef({
//     ArrowUp: false,
//     ArrowDown: false,
//     ArrowLeft: false,
//     ArrowRight: false,
//   });

//   const selectedPlayer = localStorage.getItem("selectedPlayer");

//   const modelPath = useMemo(() => {
//     switch (selectedPlayer) {
//       case "1":
//         return "/assets/models/players/player_girl_animated.glb";
//       case "2":
//         return "/assets/models/players/player_boy_animated.glb";
//       default:
//         return "/assets/models/players/player_boy_animated.glb";
//     }
//   }, [selectedPlayer]);

//   const { scene, animations } = useGLTF(modelPath);
//   const { actions } = useAnimations(animations, modelRef);

//   useEffect(() => {
//     if (!actions) return;
//     const idle = actions["idle"] || Object.values(actions)[0];
//     idle?.reset().play();
//     currentAction.current = "idle";
//   }, [actions]);

//   useEffect(() => {
//     if (!actions) return;

//     const next = isMoving ? "walking" : "idle";
//     if (currentAction.current === next) return;

//     actions[currentAction.current]?.fadeOut(0.2);
//     const nextAction = actions[next] || Object.values(actions)[0];
//     nextAction?.reset().fadeIn(0.2).play();

//     currentAction.current = next;
//   }, [isMoving, actions]);

//   useEffect(() => {
//     if (!rb.current) return;

//     rb.current.setTranslation(
//       {
//         x: spawnPosition[0],
//         y: spawnPosition[1],
//         z: spawnPosition[2],
//       },
//       true,
//     );
//   }, [spawnPosition]);

//   useEffect(() => {
//     const down = (e) => {
//       if (e.key in keys.current) keys.current[e.key] = true;
//     };
//     const up = (e) => {
//       if (e.key in keys.current) keys.current[e.key] = false;
//     };

//     window.addEventListener("keydown", down);
//     window.addEventListener("keyup", up);

//     return () => {
//       window.removeEventListener("keydown", down);
//       window.removeEventListener("keyup", up);
//     };
//   }, []);

//   useFrame(() => {
//     if (!rb.current) return;

//     const speed = 4;
//     let x = 0;
//     let z = 0;
//     let moving = false;

//     if (keys.current.ArrowUp) {
//       z -= 1;
//       moving = true;
//     }
//     if (keys.current.ArrowDown) {
//       z += 1;
//       moving = true;
//     }
//     if (keys.current.ArrowLeft) {
//       x -= 1;
//       moving = true;
//     }
//     if (keys.current.ArrowRight) {
//       x += 1;
//       moving = true;
//     }

//     if (x !== 0 || z !== 0) {
//       const len = Math.hypot(x, z);
//       x /= len;
//       z /= len;
//       direction.current = Math.atan2(x, z);
//     }

//     const vel = rb.current.linvel();

//     rb.current.setLinvel(
//       {
//         x: moving ? x * speed : 0,
//         y: vel.y,
//         z: moving ? z * speed : 0,
//       },
//       true,
//     );

//     if (modelRef.current) {
//       modelRef.current.rotation.y = direction.current;
//     }

//     if (!wasMoving.current && moving) setIsMoving(true);
//     if (wasMoving.current && !moving) setIsMoving(false);
//     wasMoving.current = moving;

//     const p = rb.current.translation();
//     onMove?.(new THREE.Vector3(p.x, p.y, p.z));
//   });

//   return (
//     <RigidBody
//       ref={rb}
//       type="dynamic"
//       colliders={false}
//       enabledRotations={[false, false, false]}
//       gravityScale={1}
//       linearDamping={4}
//       angularDamping={8}
//       canSleep={false}
//       ccd
//     >
//       <CapsuleCollider
//         args={[0.45, 0.35]}
//         collisionGroups={interactionGroups(0, [0])}
//       />
//       <group ref={modelRef} position={[0, -0.5, 0]}>
//         <primitive object={scene} />
//       </group>
//     </RigidBody>
//   );
// }
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";
export default function Player({ onMove, mode, lookAt, spawnPosition, scene }) {
  const playerRef = useRef(null);
  const direction = useRef(0);
  const wasMoving = useRef(false);

  const [isMoving, setIsMoving] = useState(false);
  const currentAction = useRef(null);

  const keys = useRef({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });
  const rb = useRef();
  const selectedPlayer = localStorage.getItem("selectedPlayer");

  const modelPath = useMemo(() => {
    switch (selectedPlayer) {
      case "1":
        return "/assets/models/players/player_girl_animated.glb";
      case "2":
        return "/assets/models/players/player_boy_animated.glb";
      case "3":
        return "/assets/models/players/player_nb_animated.glb";
      default:
        return "/assets/models/players/player_boy_animated.glb";
    }
  }, [selectedPlayer]);

  const { scene: sceneModel, animations } = useGLTF(modelPath);

  const { actions } = useAnimations(animations, playerRef);

  useEffect(() => {
    if (!actions) return;

    const idle = actions["idle"] || Object.values(actions)[0];
    idle.reset().fadeIn(0.3).play();
    currentAction.current = "idle";
  }, [actions]);

  useEffect(() => {
    if (!playerRef.current || !spawnPosition) return;

    rb.current?.setTranslation(
      {
        x: spawnPosition[0],
        y: spawnPosition[1],
        z: spawnPosition[2],
      },
      true,
    );

    onMove?.(playerRef.current.position.clone());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const down = (e) => {
      if (e.key in keys.current) keys.current[e.key] = true;
    };
    const up = (e) => {
      if (e.key in keys.current) keys.current[e.key] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    if (!actions) return;

    const next = isMoving ? "walking" : "idle";
    if (currentAction.current === next) return;

    actions[currentAction.current]?.fadeOut(0.2);

    const action = actions[next] || Object.values(actions)[0];
    action.reset().fadeIn(0.2).play();

    currentAction.current = next;
  }, [isMoving, actions]);

 useFrame(() => {
  if (mode !== "explore") return;

  // =============================
  // 🚫 CAREER → SIN FÍSICA
  // =============================
  if (scene === "CAREER") {
    if (!playerRef.current) return;

    const speed = 0.05;
    let moving = false;

    if (keys.current.ArrowUp) {
      direction.current = Math.PI;
      moving = true;
    }
    if (keys.current.ArrowDown) {
      direction.current = 0;
      moving = true;
    }
    if (keys.current.ArrowLeft) {
      direction.current = -Math.PI / 2;
      moving = true;
    }
    if (keys.current.ArrowRight) {
      direction.current = Math.PI / 2;
      moving = true;
    }

    if (moving) {
      playerRef.current.rotation.y = direction.current;

      playerRef.current.position.x += Math.sin(direction.current) * speed;
      playerRef.current.position.z += Math.cos(direction.current) * speed;

      if (!wasMoving.current) setIsMoving(true);
      wasMoving.current = true;

      onMove?.(playerRef.current.position.clone());
    } else {
      if (wasMoving.current) setIsMoving(false);
      wasMoving.current = false;
    }

    return;
  }

  // =============================
  // 🌍 WORLD → CON FÍSICA
  // =============================
  if (!rb.current) return;

  const speed = 2.5;

  let dirX = 0;
  let dirZ = 0;
  let moving = false;

  if (keys.current.ArrowUp) {
    direction.current = Math.PI;
    dirZ = -1;
    moving = true;
  }
  if (keys.current.ArrowDown) {
    direction.current = 0;
    dirZ = 1;
    moving = true;
  }
  if (keys.current.ArrowLeft) {
    direction.current = -Math.PI / 2;
    dirX = -1;
    moving = true;
  }
  if (keys.current.ArrowRight) {
    direction.current = Math.PI / 2;
    dirX = 1;
    moving = true;
  }

  if (dirX !== 0 || dirZ !== 0) {
    const len = Math.hypot(dirX, dirZ);
    dirX /= len;
    dirZ /= len;
  }

const vel = rb.current.linvel();

const targetVel = {
  x: moving ? dirX * speed : 0,
  y: vel.y,
  z: moving ? dirZ * speed : 0,
};

// 🔥 SUAVIZADO
const smooth = 0.2;

rb.current.setLinvel(
  {
    x: vel.x + (targetVel.x - vel.x) * smooth,
    y: vel.y,
    z: vel.z + (targetVel.z - vel.z) * smooth,
  },
  true
);

  if (moving && playerRef.current) {
    playerRef.current.rotation.y = direction.current;
  }

  if (!wasMoving.current && moving) setIsMoving(true);
  if (wasMoving.current && !moving) setIsMoving(false);
  wasMoving.current = moving;

  const p = rb.current.translation();
  onMove?.(new THREE.Vector3(p.x, p.y, p.z));
});
  const debugBox = false;

  if (scene === "CAREER") {
  return (
    <group ref={playerRef} scale={1}>
      <primitive object={sceneModel} />
    </group>
  );
}

return (
  <RigidBody
    ref={rb}
    type="dynamic"
    colliders={false}
    enabledRotations={[false, false, false]}
    gravityScale={1}
    linearDamping={2}
    angularDamping={8}
    canSleep={false}
    ccd
  >
    <CapsuleCollider args={[0.45, 0.35]} />

    <group ref={playerRef} position={[0, -0.5, 0]}>
      <primitive object={sceneModel} />
    </group>
  </RigidBody>
);
}
