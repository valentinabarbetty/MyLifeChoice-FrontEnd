import Player from "../../characters/Player";
import NPC from "../../characters/NPC";
import { useGLTF } from "@react-three/drei";

export default function AdministracionScene({ onExit }) {
      const { scene } = useGLTF("/assets/models/scenes/careers/administracion.glb");

  return (
    <>
      <primitive object={scene} />

      <Player mode="dialogue" />

      <NPC
        modelPath="/assets/models/npc/administracion.glb"
        animationState="talking"
      />

  
    </>
  );
}
