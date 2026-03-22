import { useState } from "react";
import "./EducacionFisicaGame.css";
const EXERCISES = [
  {
    id: 1,
    name: "Curl de bíceps",
    emoji: "💪",
    correct: "biceps",
  },
  {
    id: 2,
    name: "Sentadilla",
    emoji: "🏋️",
    correct: "piernas",
  },
  {
    id: 3,
    name: "Abdominales",
    emoji: "🧘",
    correct: "core",
  },
  {
    id: 4,
    name: "Dominadas",
    emoji: "🧗",
    correct: "espalda",
  },
];

const CATEGORIES = [
  { id: "biceps", label: "Bíceps", emoji: "💪" },
  { id: "piernas", label: "Piernas", emoji: "🦵" },
  { id: "core", label: "Abdomen", emoji: "🔥" },
  { id: "espalda", label: "Espalda", emoji: "🏋️‍♂️" },
];
export default function EducacionFisicaGame({ onComplete }) {
  const [items, setItems] = useState(EXERCISES);
  const [zones, setZones] = useState({
    biceps: [],
    piernas: [],
    core: [],
    espalda: [],
  });

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("item", JSON.stringify(item));
  };

  const handleDrop = (e, categoryId) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("item"));

    // evitar duplicados
    if (zones[categoryId].some((i) => i.id === item.id)) return;

    setZones((prev) => ({
      ...prev,
      [categoryId]: [...prev[categoryId], item],
    }));

    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleValidate = () => {
    let correct = true;

    Object.keys(zones).forEach((cat) => {
      zones[cat].forEach((item) => {
        if (item.correct !== cat) correct = false;
      });
    });

    if (correct) {
      onComplete();
    } else {
      alert("Hay ejercicios mal ubicados 😅");
    }
  };

  return (
    <div className="overlay">
      <div className="panel fisica">

        <h2>🏃 Clasifica los ejercicios</h2>
        <p>Arrastra cada ejercicio a la parte del cuerpo correspondiente</p>

        {/* 🧩 EJERCICIOS */}
        <div className="exercise-list">
          {items.map((item) => (
            <div
              key={item.id}
              className="exercise-card"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              <span className="emoji">{item.emoji}</span>
              <p>{item.name}</p>
            </div>
          ))}
        </div>

        {/* 🎯 CATEGORÍAS */}
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
                  <div key={item.id} className="exercise-card small">
                    {item.emoji}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className="btn" onClick={handleValidate}>
          CONTINUAR
        </button>
      </div>
    </div>
  );
}