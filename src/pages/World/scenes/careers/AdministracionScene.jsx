import Player from "../../characters/Player";
import NPC from "../../characters/NPC";
import { useGLTF } from "@react-three/drei";

export default function AdministracionScene({ onExit }) {
      const { scene } = useGLTF("/assets/models/scenes/careers/administracion.glb");

  return (
    <>
      <primitive object={scene} scale={0.5} position={[4, 0.5, 6]} rotation={[0, Math.PI/2,0]} />

      <Player mode="dialogue" scale={5} spawnPosition={[0, -3, 2]}
  />

      <NPC
        modelPath="/assets/models/npc/administracion.glb"
        animationState="talking"
        position={[0, -3, 0]}   // 👈 NPC
  scale={1.8}
      />

  
    </>
  );
}
