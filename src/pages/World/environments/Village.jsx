import { useGLTF } from "@react-three/drei";

export default function Village(props) {
  const { scene } = useGLTF("/assets/models/scenes/world.glb");
  return (
    <primitive 
        object={scene}
        scale={1}
        position={[3, -4, -20]}
        {...props}
    />
  );
}
