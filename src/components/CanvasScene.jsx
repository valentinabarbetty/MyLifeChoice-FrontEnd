import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function CanvasScene() {
  return (
    <Canvas camera={{ position: [0, 2, 5] }}>
      {/* Luz ambiental y direccional */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Ejemplo: un cubo */}
      <mesh rotation={[0.4, 0.2, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>

      {/* Control de cámara con mouse */}
      <OrbitControls />
    </Canvas>
  )
}
