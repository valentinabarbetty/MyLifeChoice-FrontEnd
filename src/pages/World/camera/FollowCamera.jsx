import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useEffect, useRef } from "react";

export default function CameraManager({ scene, mode, playerPos }) {
  const { camera } = useThree();

  const desiredPosition = useRef(new Vector3());
  const desiredLookAt = useRef(new Vector3());


  useEffect(() => {
    if (scene === "CAREER") {

      camera.position.set(6, 4, 8);
      camera.lookAt(0, 1, 0);
      return;
    }

    if (scene === "WORLD") {
     
      camera.position.set(playerPos.x + 6, playerPos.y + 6, playerPos.z + 10);
      camera.lookAt(playerPos.x, playerPos.y + 1, playerPos.z);
    }
  }, [scene]);


  useFrame(() => {
    if (scene === "CAREER") return;


    if (mode === "explore") {
      desiredPosition.current.set(
        playerPos.x + 6,
        playerPos.y + 6,
        playerPos.z + 10
      );
      desiredLookAt.current.set(playerPos.x, playerPos.y + 1, playerPos.z);
    }

    camera.position.lerp(desiredPosition.current, 0.08);
    camera.lookAt(desiredLookAt.current);
  });

  return null;
}