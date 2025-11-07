import React from "react";
import "./SelectGuide.css"; // puedes copiar tus estilos de ChooseGuide.css si los tenías

export default function SelectGuide({ onSelect }) {
  const guides = [
    { id: "female", name: "Lili", color: "#ffb6c1", icon: "🌸" },
    { id: "male", name: "Nick", color: "#6ecb63", icon: "🌿" },
    { id: "neutral", name: "Andrew", color: "#a18cd1", icon: "🌈" },
  ];

  const handleSelect = (guide) => {
    localStorage.setItem("selectedGuide", guide.name);
    onSelect?.(guide);
  };

  return (
    <div className="select-guide-container">
      <div className="select-guide-overlay" />
      <div className="guide-selection">
        <h1 className="choose-title">Elige tu guía</h1>

        <div className="guide-options">
          {guides.map((g) => (
            <div
              key={g.id}
              className="guide-card"
              style={{ backgroundColor: g.color }}
              onClick={() => handleSelect(g)}
            >
              <span className="guide-icon">{g.icon}</span>
              <h3>{g.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
