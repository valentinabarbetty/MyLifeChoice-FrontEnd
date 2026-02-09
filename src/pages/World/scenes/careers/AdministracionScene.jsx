import Player from "../../characters/Player";
import NPC from "../../characters/NPC";
import { useGLTF } from "@react-three/drei";

export default function AdministracionScene({ onExit }) {
  const { scene } = useGLTF("/assets/models/scenes/careers/administracion.glb");

  return (
    <group position={[4.5, 0.7, 6.5]} rotation={[0, Math.PI / 2, 0]} scale={1}>

      {/* ESCENARIO */}
      <primitive object={scene} scale={0.5} />

      {/* PLAYER */}
      <group
        position={[-0.3, 0, 2]}
        rotation={[0, Math.PI + 0.22, 0]}
      >
        <Player mode="dialogue" spawnPosition={[0, 0, 0]} />
      </group>

      {/* NPC – girado al otro lado */}
      <group
        position={[-0.3, 0, 0]}
        rotation={[0, Math.PI/2 -2, 0]}  
      >
        <NPC
          modelPath="/assets/models/npc/administracion.glb"
          animationState="talking"
          scale={4}
        />
      </group>

    </group>
  );
}
