import AccessibleHouse from "./AccessibleHouse";

export const HOUSES = [
  {
    position: [8.08, -1, -38.01], 
    career: "administracion",
  },
  {
    position: [6.06, -1, -24.39], 
    career: "logistica",
  },
  {
    position: [16.33, -2.17, -16.61], 
    career: "contaduriaPublica",
  },
  {
    position: [-5.96, -1, -18.18], 
    career: "ingenieriaIndustrial",
  },
  {
    position: [4.69, -1, -7.3],    
    career: "software",
  },
  {
    position: [29.10, -2.20, -15.10],   
    career: "alimentos",
  },
  {
    position: [35.14, -2.20, -2.52], 
    career: "agroforestal",
  },
  {
    position: [16.5, -1, 6.43],   
    career: "mantenimiento",
  },
  {
    position: [-19.24, -1.91, -12.75],  
    career: "agroambiental",
  },
  {
    position: [31.87, -2.20, 5.94],   
    career: "educacionFisica",
  },
  {
    position: [-10.85, -1, 4.15],  
    career: "psicologia",
  },
  {
    position: [-0.51, -1, 7.01],   
    career: "literatura",
  },
  {
    position: [22.88, -2.14, -2.37],   
    career: "electronica",
  },
];

export default function Houses({ onInteract }) {
  return (
    <>
      {HOUSES.map((house) => (
        <AccessibleHouse
          key={house.career}
          position={house.position}
          career={house.career}
          onInteract={onInteract}
        />
      ))}
    </>
  );
}