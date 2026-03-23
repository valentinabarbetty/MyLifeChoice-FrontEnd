

import ClassificationGame from "../../../ui/ClassificationGame/ClassificationGame";


const CASES = [
  {
    id: 1,
    text: "Un alimento tiene un olor extraño y el envase está inflado.",
    correct: "mal_estado",
  },
  {
    id: 2,
    text: "Un producto no tiene fecha de vencimiento en la etiqueta.",
    correct: "etiqueta",
  },
  {
    id: 3,
    text: "La carne fue almacenada a temperatura ambiente durante varias horas.",
    correct: "proceso",
  },
  {
    id: 4,
    text: "El envase de un producto está roto y el alimento está expuesto al aire.",
    correct: "empaque",
  },
  {
    id: 5,
    text: "Un lote de yogur fue transportado sin refrigeración.",
    correct: "proceso",
  },
  {
    id: 6,
    text: "Un trabajador manipuló alimentos sin higiene adecuada.",
    correct: "proceso",
  },
];

const CATEGORIES = [
  { id: "mal_estado", label: "Alimento en mal estado", emoji: "⚠️" },
  { id: "empaque", label: "Problema de empaque", emoji: "📦" },
  { id: "etiqueta", label: "Falta de etiqueta", emoji: "🏷️" },
  { id: "proceso", label: "Error en proceso", emoji: "⚙️" },
];

export default function AlimentosGame({ onComplete }) {
  return (
    <ClassificationGame
      title="Clasifica los alimentos"
      subtitle="Arrastra cada situación a la categoría correcta"
      itemsData={CASES}
      categories={CATEGORIES}
      onComplete={onComplete}
      renderItem={(item) => (
        <div
          className={item.image ? "card-content with-image" : "card-content"}
        >
          {item.image && <img src={item.image} />}
          <p>{item.text || item.name}</p>
        </div>
      )}
      errorMessage="Revisa bien los problemas de alimentos e intenta nuevamente"
    />
  );
}
