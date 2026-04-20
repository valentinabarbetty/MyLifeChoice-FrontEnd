import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FloatingCloud from "./elements/FunctionCloud";
import Sea from "./elements/Sea";
import { Physics } from "@react-three/rapier";

export default function WorldCanvas({ children }) {
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
  
      <color attach="background" args={["#87CEEB"]} />

  
      <ambientLight intensity={1.2} color="#ffffff" />
      
 
      <directionalLight
        position={[10, 20, 5]}
        intensity={1.5}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      

      <directionalLight
        position={[0, -5, 0]}
        intensity={0.5}
        color="#aaddff"
      />
      
   
      <directionalLight
        position={[0, 10, -10]}
        intensity={0.8}
        color="#ffffff"
      />


      <pointLight
        position={[0, 5, 10]}
        intensity={0.6}
        color="#ffffff"
      />

      <directionalLight
        position={[-10, 10, 0]}
        intensity={0.5}
        color="#ffeedd"
      />

    
      <directionalLight
        position={[10, 10, 0]}
        intensity={0.5}
        color="#ffeedd"
      />


      <FloatingCloud position={[-4, 7, -8]} scale={1.2} speed={0.001} />
      <FloatingCloud position={[2, 6.5, -10]} scale={0.9} speed={0.0008} />
      <FloatingCloud position={[6, 7.5, -9]} scale={1.1} speed={0.0012} />
      <FloatingCloud position={[0, 8, -12]} scale={1.0} speed={0.0009} />
      <FloatingCloud position={[-2, 7.2, -6]} scale={0.8} speed={0.0011} />
      <FloatingCloud position={[4, 6.8, -7]} scale={0.9} speed={0.001} />


      <Sea position={[0, -6, 0]} size={300} />


      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        enableDamping
        dampingFactor={0.06}
      />


      {children}
    </Canvas>
  );
}