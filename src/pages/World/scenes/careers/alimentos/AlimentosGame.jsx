import { useState } from "react";
import ConfettiEffect from "../../../ui/Confetti";
import GameCompleteModal from "../../../ui/GameCompleteModal/GameCompleteModal";
import "./AlimentosGame.css";
import Swal from "sweetalert2";


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
  const [items, setItems] = useState(CASES);
  const [zones, setZones] = useState({
    mal_estado: [],
    empaque: [],
    etiqueta: [],
    proceso: [],
  });

  const [gameFinished, setGameFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("item", JSON.stringify(item));
  };
  const showError = () => {
    Swal.fire({
      title: "Casi lo logras 😅",
      text: "Revisa bien las opciones y vuelve a intentar",
      icon: "warning",
      confirmButtonText: "Reintentar",
      confirmButtonColor: "#22c55e",
      background: "#fef7e7",
      backdrop: `rgba(0,0,0,0.4)`,
    });
  };
  const handleDrop = (e, zone) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("item"));

    let newZones = {};
    let movedFromItems = false;

    Object.keys(zones).forEach((z) => {
      if (zones[z].some((i) => i.id === item.id)) {
        newZones[z] = zones[z].filter((i) => i.id !== item.id);
      } else {
        newZones[z] = zones[z];
      }
    });

    if (items.some((i) => i.id === item.id)) {
      movedFromItems = true;
    }

    newZones[zone] = [...newZones[zone], item];

    setZones(newZones);


    if (movedFromItems) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    }
  };

  const handleContinue = () => {
    let correct = true;

    Object.keys(zones).forEach((zone) => {
      zones[zone].forEach((item) => {
        if (item.correct !== zone) correct = false;
      });
    });

    if (!correct) {
      showError();
      return;
    }

    setGameFinished(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  if (gameFinished) {
    return (
      <div className="overlay">
        {showConfetti && <ConfettiEffect />}
        <GameCompleteModal
          title="¡Excelente!"
          message="Clasificaste correctamente los problemas de alimentos."
          onContinue={onComplete}
        />
      </div>
    );
  }

  return (
    <div className="overlay">
      <div className="panel alimentos">
        <h2 className="title">Clasifica los alimentos</h2>
        <p className="subtitle">
          Arrastra cada situación a la categoría correcta
        </p>

        <div className="game-layout">
          <div className="cases">
            {items.map((item) => (
              <div
                key={item.id}
                className="case-card"
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
              >
                {item.text}
              </div>
            ))}
          </div>

          <div className="categories">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="drop-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, cat.id)}
              >
                <h3>
                  {cat.emoji} {cat.label}
                </h3>

                <div className="drop-content">
                  {zones[cat.id].map((item) => (
                    <div
                      key={item.id}
                      className="case-card small"
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                    >
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn" onClick={handleContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
}
