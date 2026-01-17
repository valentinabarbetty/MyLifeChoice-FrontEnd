export default function Sea({
  position = [0, 0, 0],
  size = 200,
}) {
  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]} // plano horizontal
      receiveShadow={false}
    >
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial
        color="#4fa3c7"   // azul mar cozy
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}
