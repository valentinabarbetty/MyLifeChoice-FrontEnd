import { A11y, useA11y } from "@react-three/a11y";
import { Html } from "@react-three/drei";
import { useRef } from "react";

const DESCRIPTIONS = {
  administracion: "Casa de Administración de Empresas. Raquelle te espera para hablar sobre gestión de empresas, liderazgo y organización. Presiona Enter para explorar esta carrera.",
  logistica: "Casa de Logística. Michael te enseñará sobre cadena de suministro, transporte y distribución. Presiona Enter para explorar esta carrera.",
  ingenieriaIndustrial: "Casa de Ingeniería Industrial. Laura te explicará sobre optimización de procesos, calidad y productividad. Presiona Enter para explorar esta carrera.",
  software: "Casa de Desarrollo de Software. Brayan Julio te guiará en programación, aplicaciones y tecnología. Presiona Enter para explorar esta carrera.",
  psicologia: "Casa de Psicología. Mia te hablará sobre el estudio de la mente humana, comportamiento y bienestar. Presiona Enter para explorar esta carrera.",
  contaduriaPublica: "Casa de Contaduría Pública. Isabella te enseñará sobre finanzas, auditoría y gestión contable. Presiona Enter para explorar esta carrera.",
  electronica: "Casa de Electrónica Industrial. Sabrina te mostrará sobre circuitos, automatización y control industrial. Presiona Enter para explorar esta carrera.",
  alimentos: "Casa de Procesamiento de Alimentos. Olivia te explicará sobre tecnología alimentaria y control de calidad. Presiona Enter para explorar esta carrera.",
  agroambiental: "Casa de Tecnología Agroambiental. Liam te hablará sobre agricultura sostenible y medio ambiente. Presiona Enter para explorar esta carrera.",
  mantenimiento: "Casa de Mantenimiento Electromecánico. Mathías te enseñará sobre sistemas electromecánicos y mantenimiento industrial. Presiona Enter para explorar esta carrera.",
  agroforestal: "Casa de Producción Agroforestal. Emily te explicará sobre manejo de bosques y producción sostenible. Presiona Enter para explorar esta carrera.",
  educacionFisica: "Casa de Educación Física. Samuel te guiará sobre deportes, actividad física y pedagogía. Presiona Enter para explorar esta carrera.",
  literatura: "Casa de Literatura. Emma te hablará sobre análisis literario, escritura y pedagogía. Presiona Enter para explorar esta carrera.",
};

const NAMES = {
  administracion: "Administración de empresas",
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

function HouseMesh({ career }) {
  const a11y = useA11y();
  const isFocused = a11y.focus || a11y.hover;

  return (
    <>
      {isFocused && (
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

      <mesh castShadow receiveShadow visible={false}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

 
    </>
  );
}

export default function AccessibleHouse({ position, career, onInteract }) {
  return (
    <group position={position}>
      <A11y
        role="button"
        description={DESCRIPTIONS[career]}
        activationMsg={`Explorando carrera de ${NAMES[career]}`}
        actionCall={() => onInteract(career)}
      >
        <HouseMesh career={career} />
      </A11y>
    </group>
  );
}