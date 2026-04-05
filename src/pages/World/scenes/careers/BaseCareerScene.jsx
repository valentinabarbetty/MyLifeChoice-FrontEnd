import Player from "../../characters/Player";
import NPC from "../../characters/NPC";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

export default function BaseCareerScene({
  careerId,
  children
}) {
  const { scene } = useGLTF(
    `/assets/models/scenes/careers/${careerId}.glb`
  );
  console.log(careerId);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return (
    <group
      position={[2.8, 0.7, 3]}
      rotation={[0, Math.PI / 2, 0]}
      scale={1}
    >
      <primitive object={clonedScene} scale={0.5} frustumCulled={false}/>

      <group
        position={[-0.3, 0, 2]}
        rotation={[0, Math.PI + 0.22, 0]}
      >
        <Player mode="dialogue" spawnPosition={[0, 0, 0]} scene="CAREER" />
      </group>

      <group
        position={[-0.3, 0, 0]}
        rotation={[0, Math.PI / 2 - 2, 0]}
      >
        <NPC
          modelPath={`/assets/models/npc/${careerId}.glb`}
          animationState="talking"
          scale={4}
        />
      </group>
      {children}
    </group>
  );
}
