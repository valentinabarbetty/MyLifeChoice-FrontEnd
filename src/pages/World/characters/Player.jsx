import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Player({ onMove, mode, lookAt, spawnPosition }) {
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

  const { scene, animations } = useGLTF(modelPath);

 
  const { actions } = useAnimations(animations, playerRef);


  useEffect(() => {
    if (!actions) return;

    const idle = actions["idle"] || Object.values(actions)[0];
    idle.reset().fadeIn(0.3).play();
    currentAction.current = "idle";
  }, [actions]);


  useEffect(() => {
    if (!playerRef.current || !spawnPosition) return;

    playerRef.current.position.set(
      spawnPosition[0],
      spawnPosition[1],
      spawnPosition[2]
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
    if (!playerRef.current) return;

    if (lookAt) {
      playerRef.current.lookAt(
        lookAt[0],
        playerRef.current.position.y,
        lookAt[2]
      );
    }


    if (mode !== "explore") return;

    const speed = 0.05;

    let moving = false;

   
    if (keys.current.ArrowUp) {
      direction.current = Math.PI; // norte
      moving = true;
    }
    if (keys.current.ArrowDown) {
      direction.current = 0; // sur
      moving = true;
    }
    if (keys.current.ArrowLeft) {
      direction.current = -Math.PI / 2; // oeste
      moving = true;
    }
    if (keys.current.ArrowRight) {
      direction.current = Math.PI / 2; // este
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
  });

 
  const debugBox = false;

  return (
    <group ref={playerRef} scale={1}>
      <primitive object={scene} />

      {debugBox && (
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial />
        </mesh>
      )}
    </group>
  );
}
