import { forwardRef } from "react";

const Cloud = forwardRef(function Cloud(
  { position = [0, 0, 0], scale = 1 },
  ref
) {
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>

      <mesh position={[1.2, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>

      <mesh position={[-1.1, 0.1, 0]} castShadow>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>
      <mesh position={[0.5, 0.6, 0.2]} castShadow>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.8} />
      </mesh>

      <mesh position={[-0.4, 0.5, 0.1]} castShadow>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.8} />
      </mesh>
    </group>
  );
});

export default Cloud;