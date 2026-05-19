const NAMES = {
  administracion: "Administración de Empresas",
  logistica: "Tecnología en Gestión Logística",
  ingenieriaIndustrial: "Ingeniería Industrial",
  software: "Tecnología en Desarrollo de Software",
  psicologia: "Psicología",
  contaduriaPublica: "Contaduría Pública",
  electronica: "Tecnología en Electrónica Industrial",
  alimentos: "Tecnología en Procesamiento de Alimentos",
  agroambiental: "Tecnología Agroambiental",
  mantenimiento: "Tecnología en Mantenimiento de Sistemas Electromecánicos",
  agroforestal: "Tecnología en Manejo de la Producción Agroforestal",
  educacionFisica: "Educación Física",
  literatura: "Licenciatura en Literatura",
};

function HouseMesh({ highlighted }) {
  return (
    <>
      {highlighted && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.3, 2.3, 2.3]} />
          <meshBasicMaterial
            color="#FFD700"
            wireframe={true}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </>
  );
}

export default function AccessibleHouse({ position, career, highlighted }) {
  return (
    <group position={position}>
      <HouseMesh career={career} highlighted={highlighted} />
    </group>
  );
}