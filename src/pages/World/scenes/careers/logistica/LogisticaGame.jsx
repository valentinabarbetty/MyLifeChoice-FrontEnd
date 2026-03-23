import ClassificationGame from "../../../ui/ClassificationGame/ClassificationGame";


const CASES = [
  {
    id: 1,
    text: "Un producto debe llegar rápido a otro país.",
    correct: "avion",
  },
  {
    id: 2,
    text: "Una empresa necesita transportar grandes cantidades de productos entre ciudades cercanas.",
    correct: "camion",
  },
  {
    id: 3,
    text: "Una empresa exporta miles de toneladas de productos a otro continente y no necesita que lleguen rápidamente.",
    correct: "barco",
  },
  {
    id: 4,
    text: "Una compañía necesita transportar mercancía pesada entre ciudades conectadas por vías férreas.",
    correct: "tren",
  },
  {
    id: 5,
    text: "Un paquete pequeño debe enviarse rápidamente entre dos ciudades muy lejanas del mismo país.",
    correct: "avion",
  },
];

const CATEGORIES = [
  { id: "avion", label: "Avión", emoji: "✈️" },
  { id: "barco", label: "Barco", emoji: "🚢" },
  { id: "camion", label: "Camión", emoji: "🚚" },
  { id: "tren", label: "Tren", emoji: "🚆" },
];

export default function LogisticaGame({ onComplete }) {
  return (
    <ClassificationGame
      title="Clasifica los transportes"
      subtitle="Arrastra cada situación al medio de transporte correcto"
      itemsData={CASES}
      categories={CATEGORIES}
      onComplete={onComplete}
      errorMessage="Revisa bien los medios de transporte y vuelve a intentar 🚚"
      renderItem={(item) => <p>{item.text}</p>}
    />
  );
}