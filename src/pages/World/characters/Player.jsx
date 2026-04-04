import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export default function Player({ onMove, mode, spawnPosition }) {
  const rb = useRef();
  const modelRef = useRef();

  const [isMoving, setIsMoving] = useState(false);
  const currentAction = useRef(null);
  const wasMoving = useRef(false);
  const direction = useRef(0);

  const keys = useRef({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  const selectedPlayer = localStorage.getItem("selectedPlayer");

  const modelPath = useMemo(() => {
    switch (selectedPlayer) {
      case "1":
        return "/assets/models/players/player_girl_animated.glb";
      case "2":
        return "/assets/models/players/player_boy_animated.glb";
      default:
        return "/assets/models/players/player_boy_animated.glb";
    }
  }, [selectedPlayer]);

  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, modelRef);

  useEffect(() => {
    if (!actions) return;
    const idle = actions["idle"] || Object.values(actions)[0];
    idle?.reset().play();
    currentAction.current = "idle";
  }, [actions]);
  const lastPos = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!actions) return;

    const next = isMoving ? "walking" : "idle";
    if (currentAction.current === next) return;

    actions[currentAction.current]?.fadeOut(0.2);
    const nextAction = actions[next] || Object.values(actions)[0];
    nextAction?.reset().fadeIn(0.2).play();

    currentAction.current = next;
  }, [isMoving, actions]);

  useEffect(() => {
    if (!rb.current) return;

    const saved = localStorage.getItem("playerPosition");

    if (saved) {
      const pos = JSON.parse(saved);

      rb.current.setTranslation(
        {
          x: pos.x,
          y: pos.y,
          z: pos.z,
        },
        true,
      );
    } else {
      rb.current.setTranslation(
        {
          x: spawnPosition[0],
          y: spawnPosition[1],
          z: spawnPosition[2],
        },
        true,
      );
    }
  }, [spawnPosition]);


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

  useFrame(() => {
    if (!rb.current) return;

    const speed = 4;
    let x = 0;
    let z = 0;
    let moving = false;

    if (keys.current.ArrowUp) {
      z -= 1;
      moving = true;
    }
    if (keys.current.ArrowDown) {
      z += 1;
      moving = true;
    }
    if (keys.current.ArrowLeft) {
      x -= 1;
      moving = true;
    }
    if (keys.current.ArrowRight) {
      x += 1;
      moving = true;
    }

    if (x !== 0 || z !== 0) {
      const len = Math.hypot(x, z);
      x /= len;
      z /= len;
      direction.current = Math.atan2(x, z);
    }

    const vel = rb.current.linvel();

    if (moving) {
      rb.current.setLinvel(
        {
          x: x * speed,
          y: vel.y,
          z: z * speed,
        },
        true,
      );
    } else {
      rb.current.setLinvel(
        {
          x: 0,
          y: vel.y,
          z: 0,
        },
        true,
      );
    }
    if (modelRef.current) {
      modelRef.current.rotation.y = direction.current;
    }

    if (!wasMoving.current && moving) setIsMoving(true);
    if (wasMoving.current && !moving) setIsMoving(false);
    wasMoving.current = moving;

    const p = rb.current.translation();
    // const dx = Math.abs(p.x - lastPos.current.x);
    // const dz = Math.abs(p.z - lastPos.current.z);

    // if (dx > 0.1 || dz > 0.1) {
    //   console.log(
    //     `POS → x:${p.x.toFixed(2)} y:${p.y.toFixed(2)} z:${p.z.toFixed(2)}`,
    //   );
    //   lastPos.current.set(p.x, p.y, p.z);
   // }

    if (!rb.current._lastSave) rb.current._lastSave = 0;

    const now = Date.now();

    if (now - rb.current._lastSave > 500) {
      localStorage.setItem(
        "playerPosition",
        JSON.stringify({
          x: p.x,
          y: p.y,
          z: p.z,
        }),
      );

      rb.current._lastSave = now;
    }
    onMove?.(new THREE.Vector3(p.x, p.y, p.z));
  });

  return (
    <RigidBody
      ref={rb}
      type="dynamic"
      colliders={false}
      enabledRotations={[false, false, false]}
      gravityScale={2}
      linearDamping={8}
      angularDamping={8}
      ccd
    >
      <CapsuleCollider args={[0.45, 0.35]} />
      <group ref={modelRef} position={[0, -0.9, 0]}>
        <primitive object={scene} />
      </group>
    </RigidBody>
  );
}
