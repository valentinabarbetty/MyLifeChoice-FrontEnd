import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useEffect, useRef } from "react";

export default function CameraManager({ scene, mode, playerPosRef }) {
  const { camera } = useThree();

  const desiredPosition = useRef(new Vector3());
  const desiredLookAt = useRef(new Vector3());

  useEffect(() => {
    if (!playerPosRef?.current) return;

    if (scene === "CAREER") {
      camera.position.set(6, 4, 8);
      camera.lookAt(0, 1, 0);
      return;
    }

    if (scene === "WORLD") {
      const pos = playerPosRef.current;

      camera.position.set(pos.x + 6, pos.y + 6, pos.z + 10);
      camera.lookAt(pos.x, pos.y + 1, pos.z);
    }
  }, [scene, playerPosRef]);

  useFrame(() => {
    if (scene === "CAREER") return;
    if (!playerPosRef?.current) return;

    const pos = playerPosRef.current;

    if (mode === "explore") {
      desiredPosition.current.set(
        pos.x + 6,
        pos.y + 6,
        pos.z + 10
      );

      desiredLookAt.current.set(
        pos.x,
        pos.y + 1,
        pos.z
      );
    }

    camera.position.lerp(desiredPosition.current, 0.08);
    camera.lookAt(desiredLookAt.current);
  });

  return null;
}