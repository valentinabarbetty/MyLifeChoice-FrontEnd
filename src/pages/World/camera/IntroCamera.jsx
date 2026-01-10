import { useFrame, useThree } from "@react-three/fiber";

export default function IntroCamera({ playerPos, guidePos, active }) {
  const { camera } = useThree();

  useFrame(() => {
    if (!active) return;

    camera.position.lerp(
      {
        x: (playerPos.x + guidePos.x) / 2,
        y: 2.2,
        z: (playerPos.z + guidePos.z) / 2 + 6,
      },
      0.05
    );

    camera.lookAt(guidePos.x, guidePos.y + 1, guidePos.z);
  });

  return null;
}
