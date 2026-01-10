export default function NPCCharacter({ position, onInteract }) {
//const { scene } = useGLTF("/assets/models/characters/npc.glb");
  return (
    <mesh position={position} onClick={onInteract}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
