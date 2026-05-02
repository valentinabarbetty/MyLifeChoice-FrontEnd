import { useGLTF } from "@react-three/drei";

export default function Floor(props) {
  const { scene } = useGLTF("/assets/models/scenes/floor.glb");

  return <primitive object={scene} {...props} />;
}