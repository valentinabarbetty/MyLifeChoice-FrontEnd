import { forwardRef, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

const Village = forwardRef(function Village(props, ref) {
  const { scene } = useGLTF("/assets/models/scenes/world.glb");

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (!child.isMesh) return;

      const name = (child.name || "").toLowerCase();
      if (
        name.includes("tree") ||
        name.includes("mat_tree") ||
        name.includes("stump")
      ) {
        child.layers.enable(1);
      }
    });
  }, [clonedScene]);

  return (
    <primitive
      ref={ref}
      object={clonedScene}
      scale={1}
      position={[3, -4, -20]}
      {...props}
    />
  );
});

export default Village;