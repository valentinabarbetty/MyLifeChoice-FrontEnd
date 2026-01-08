import { forwardRef } from "react";

const Cloud = forwardRef(function Cloud(
  { position = [0, 0, 0], scale = 1 },
  ref
) {
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.6} // 👈 aquí controlas qué tan transparente
          roughness={1}
          metalness={0}
        />
      </mesh>

      <mesh position={[1.2, 0.2, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.6} // 👈 aquí controlas qué tan transparente
          roughness={1}
          metalness={0}
        />
      </mesh>

      <mesh position={[-1.1, 0.1, 0]}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.6} // 👈 aquí controlas qué tan transparente
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  );
});

export default Cloud;
