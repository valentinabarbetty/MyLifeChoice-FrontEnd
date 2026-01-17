import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useRef } from "react";

export default function CameraManager({
  mode,
  playerPos,
  guidePos,
  npcPos,
  introCenter,
}) {
  const { camera } = useThree();

  const desiredPosition = useRef(new Vector3());
  const desiredLookAt = useRef(new Vector3());

  useFrame(() => {
    if (mode === "intro" && introCenter) {
         camera.fov += (20 - camera.fov) * 1; 
  camera.updateProjectionMatrix();
    desiredPosition.current.set(
      introCenter[1] + 2,   
      introCenter[2] + 1,   
      introCenter[1] + 6    
    );

    desiredLookAt.current.set(
      introCenter[0] - 1,
      introCenter[1] + 1.9,
      introCenter[2]
    );
  }

  camera.position.lerp(desiredPosition.current, 0.12);
  camera.lookAt(desiredLookAt.current);


    if (mode === "explore") {
      desiredPosition.current.set(
        playerPos.x + 6,
        playerPos.y + 6,
        playerPos.z + 10
      );
      desiredLookAt.current.set(playerPos.x, playerPos.y + 1, playerPos.z);
    }


    if (mode === "dialogue" && npcPos) {
      desiredPosition.current.set(
        (playerPos.x + npcPos.x) / 2,
        2,
        (playerPos.z + npcPos.z) / 2 + 5
      );
      desiredLookAt.current.set(npcPos.x, npcPos.y + 1, npcPos.z);
    }

    camera.position.lerp(desiredPosition.current, 0.08);
    camera.lookAt(desiredLookAt.current);
  });

  return null;
}
