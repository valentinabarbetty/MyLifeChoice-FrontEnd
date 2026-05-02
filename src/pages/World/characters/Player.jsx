import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import footstepsSound from "/assets/music/Footsteps.mp3";
import * as THREE from "three";

export default function Player({ onMove, mode, lookAt, spawnPosition, scene, scale }) {
  const playerRef = useRef(null);
  const direction = useRef(0);
  const wasMoving = useRef(false);
  const footstepsRef = useRef(null);
  const lastPosition = useRef({ x: 0, z: 0 }); // Guarda la última posición para detectar cambios

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

    rb.current.setLinvel(
      {
        x: targetVel.x,
        y: vel.y,
        z: targetVel.z,
      },
      true,
    );

    if (moving && playerRef.current) {
      playerRef.current.rotation.y = direction.current;
    }

    if (!wasMoving.current && moving) setIsMoving(true);
    if (wasMoving.current && !moving) setIsMoving(false);
    wasMoving.current = moving;
    
    // 🎧 FOOTSTEPS
    if (moving) {
      if (footstepsRef.current && footstepsRef.current.paused) {
        footstepsRef.current.play().catch(() => {});
      }
    } else {
      if (footstepsRef.current && !footstepsRef.current.paused) {
        footstepsRef.current.pause();
        footstepsRef.current.currentTime = 0;
      }
    }
    
    const p = rb.current.translation();
    
    if (p.x !== lastPosition.current.x || p.z !== lastPosition.current.z) {
      console.log(`📍 Posición del jugador - X: ${p.x.toFixed(2)}, Y: ${p.y.toFixed(2)}, Z: ${p.z.toFixed(2)}`);
      lastPosition.current = { x: p.x, z: p.z };
    }
    
    onMove?.(new THREE.Vector3(p.x, p.y, p.z));
  });
  
  const debugBox = false;

  if (scene === "CAREER") {
    return (
      <group ref={playerRef} scale={scale}>
        <primitive object={sceneModel} />
      </group>
    );
  }
  
  useEffect(() => {
    footstepsRef.current = new Audio(footstepsSound);
    footstepsRef.current.loop = true;
    footstepsRef.current.volume = 0.5;

    return () => {
      footstepsRef.current?.pause();
    };
  }, []);
  
  return (
    <RigidBody
      ref={rb}
      type="KinematicPosition"
      colliders={false}
      enabledRotations={[false, false, false]}
      gravityScale={1}
      linearDamping={2}
      angularDamping={8}
      canSleep={false}
      ccd
      interpolation
    >
      <CapsuleCollider args={[0.45, 0.35]} />

      <group ref={playerRef} position={[0, -0.5, 0]}>
        <primitive object={sceneModel} />
      </group>
    </RigidBody>
  );
}