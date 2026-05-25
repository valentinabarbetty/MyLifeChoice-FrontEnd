import Player from "../../characters/Player";
import NPC from "../../characters/NPC";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

export default function BaseCareerScene({
  careerId,
  currentAnimation,
  children,
  npcPosition = [-0.3, 0.2, 0],
  playerPosition = [-0.3, 0.2, 2],
  playerScale = 1,
  npcScale = 1
}) {
  const { scene } = useGLTF(
    `/assets/models/scenes/careers/${careerId}.glb`
  );
  //console.log(careerId);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return (
    <group
      position={[2.8, 0.7, 3]}
      rotation={[0, Math.PI / 2, 0]}
      scale={1}
    >
      <primitive object={clonedScene} scale={0.5} frustumCulled={false}/>

      <group
        position={playerPosition}
        rotation={[0, Math.PI + 0.3, 0]}
      >
        <Player mode="dialogue" spawnPosition={[0, 0, 0]} scene="CAREER" scale={playerScale}/>
      </group>

      <group
        position={npcPosition}  
        rotation={[0, Math.PI / 2 - 1.5, 0]}
      >
        <NPC
          modelPath={`/assets/models/npc/${careerId}.glb`}
          animationState={currentAnimation || "idle"}
          scale={npcScale}
        />
      </group>
      {children}
    </group>
  );
}