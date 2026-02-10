import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

export default function Village(props) {
  const { scene } = useGLTF("/assets/models/scenes/world.glb");

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return (
    <primitive
      object={clonedScene}
      scale={1}
      position={[3, -4, -20]}
      {...props}
    />
  );
}
