import OrderGame from "../../../ui/OrderGame/OrderGame";
const STEPS = [
  {
    id: "probar",
    label: "Probar la máquina",
    image: "/assets/ui/Mantenimiento/turn-on.png",
  },
  {
    id: "revisar",
    label: "Revisar los componentes",
    image: "/assets/ui/Mantenimiento/looking.png",
  },
  {
    id: "apagar",
    label: "Apagar la máquina",
    image: "/assets/ui/Mantenimiento/turn-off.png",
  },
  {
    id: "reparar",
    label: "Reparar el problema",
    image: "/assets/ui/Mantenimiento/mechanic.png",
  },
];

const CORRECT_ORDER = ["apagar", "revisar", "reparar", "probar"];

export default function MantenimientoGame({ onComplete }) {
  return (
    <OrderGame
      title="Ordena el proceso de mantenimiento"
      subtitle="Arrastra los pasos en el orden correcto para reparar la máquina"
      itemsData={STEPS}
      correctOrder={CORRECT_ORDER}
      onComplete={onComplete}
      errorMessage="Revisa el orden del proceso antes de continuar ⚙️"
      renderItem={(item) => (
        <>
          <img src={item.image} alt={item.label} />
          <p>{item.label}</p>
        </>
      )}
    />
  );
}
