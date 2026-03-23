import OrderGame from "../../../ui/OrderGame/OrderGame";

const STEPS = [
  {
    id: "receptor",
    label: "Receptor (bombilla)",
    image: "/assets/ui/Electronica/bulb.png",
  },
  {
    id: "generador",
    label: "Generador (batería)",
    image: "/assets/ui/Electronica/battery.png",
  },
  {
    id: "control",
    label: "Elemento de control (interruptor)",
    image: "/assets/ui/Electronica/switch.png",
  },
  {
    id: "conductor",
    label: "Conductor (cable)",
    image: "/assets/ui/Electronica/wire.png",
  },
];

const CORRECT_ORDER = [
  "generador",
  "conductor",
  "control",
  "receptor",
];

export default function ElectronicaGame({ onComplete }) {
  return (
    <OrderGame
      title="⚡ Ordena el circuito eléctrico"
      subtitle="Organiza los elementos en el orden correcto para que funcione el circuito"
      itemsData={STEPS}
      correctOrder={CORRECT_ORDER}
      onComplete={onComplete}
      errorMessage="Revisa el flujo de energía en el circuito 🔌"
      renderItem={(item) => (
        <>
          <img src={item.image} alt={item.label} />
          <p>{item.label}</p>
        </>
      )}
    />
  );
}