export default function NPCCharacter({ position, onInteract }) {
  return (
    <mesh position={position} onClick={onInteract}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
