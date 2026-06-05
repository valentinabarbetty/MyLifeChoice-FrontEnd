const srOnly = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "1px",
  height: "1px",
  padding: 0,
  margin: 0,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
  zIndex: -1,
};

const CAREERS = {
  administracion: {
    name: "Administración de Empresas",
    desc: "Raquelle te espera para hablar sobre gestión de empresas, liderazgo y organización.",
  },
  logistica: {
    name: "Tecnología en Gestión Logística",
    desc: "Michael te enseñará sobre cadena de suministro, transporte y distribución.",
  },
  ingenieriaIndustrial: {
    name: "Ingeniería Industrial",
    desc: "Laura te explicará sobre optimización de procesos, calidad y productividad.",
  },
  software: {
    name: "Tecnología en Desarrollo de Software",
    desc: "Dustin te guiará en programación, aplicaciones y tecnología.",
  },
  psicologia: {
    name: "Psicología",
    desc: "Mia te hablará sobre el estudio de la mente humana, comportamiento y bienestar.",
  },
  contaduriaPublica: {
    name: "Contaduría Pública",
    desc: "Isabella te enseñará sobre finanzas, auditoría y gestión contable.",
  },
  electronica: {
    name: "Tecnología en Electrónica Industrial",
    desc: "Sabrina te mostrará sobre circuitos, automatización y control industrial.",
  },
  alimentos: {
    name: "Tecnología en Procesamiento de Alimentos",
    desc: "Olivia te explicará sobre tecnología alimentaria y control de calidad.",
  },
  agroambiental: {
    name: "Tecnología Agroambiental",
    desc: "Liam te hablará sobre agricultura sostenible y medio ambiente.",
  },
  mantenimiento: {
    name: "Tecnología en Mantenimiento de Sistemas Electromecánicos",
    desc: "Mathías te enseñará sobre sistemas electromecánicos y mantenimiento industrial.",
  },
  agroforestal: {
    name: "Tecnología en Manejo de la Producción Agroforestal",
    desc: "Emily te explicará sobre manejo de bosques y producción sostenible.",
  },
  educacionFisica: {
    name: "Licenciatura enEducación Física",
    desc: "Samuel te guiará sobre deportes, actividad física y pedagogía.",
  },
  literatura: {
    name: "Licenciatura en Literatura",
    desc: "Emma te hablará sobre análisis literario, escritura y pedagogía.",
  },
};

export default function A11yCareerPanel({ onInteract, onHighlight }) {
  return (
    <nav aria-label="Carreras universitarias disponibles" style={srOnly}>
      <h2>Selecciona una carrera para explorar</h2>
      <p>
        Hay 13 carreras disponibles. Usa Tab para navegar entre ellas y Enter
        para explorar cada una.
      </p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {Object.entries(CAREERS).map(([key, { name, desc }]) => (
          <li key={key}>
            <button
              aria-label={`${name}. ${desc} Presiona Enter para explorar esta carrera.`}
              onFocus={() => onHighlight(key)}
              onBlur={() => onHighlight(null)}
              onClick={() => onInteract(key)}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}