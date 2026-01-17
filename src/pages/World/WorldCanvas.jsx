import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FloatingCloud from "./elements/FunctionCloud";
import Sea from "./elements/Sea";

export default function WorldCanvas({ children }) {
  const skyColor = "#b8e1ff"; // cielo azul día soleado

  return (
    <Canvas
      shadows
      camera={{
        position: [6, 6, 10],
        fov: 40,
        near: 0.1,
        far: 100,
      }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <color attach="background" args={[skyColor]} />

      <ambientLight intensity={2} />
      <directionalLight
        position={[10, 18, 10]}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />

      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.9}
        color="#ffffff"
        castShadow={false}
      />

      <FloatingCloud position={[-4, 7, -8]} scale={1.2} speed={0.0015} />
      <FloatingCloud position={[2, 6.5, -10]} scale={0.9} speed={0.001} />
      <FloatingCloud position={[6, 7.5, -9]} scale={1.1} speed={0.0018} />

      <Sea position={[0, -6, 0]} size={300} />

      <OrbitControls
        enablePan
        enableZoom
        enableDamping
        dampingFactor={0.06}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={5}
        maxDistance={20}
      />

      {children}
    </Canvas>
  );
}
