import React from "react";
import "./SelectPlayer.css";
import { addPlayer } from "../../../../services/userService";
import { addGuide } from "../../../../services/userService";
export default function SelectPlayer({ onSelect }) {
  const players = [
    { id: 1, name: "girl", color: "#ffb6c1", icon: "🌸" },
    { id: 2, name: "boy", color: "#6ecb63", icon: "🌿" },
    { id: 3, name: "non-binary", color: "#a18cd1", icon: "🌈" },
  ];

  const handleSelect = async (player) => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      // Si no hay sesión todavía → guarda localmente
      localStorage.setItem("selectedPlayer", player.id);
      console.log("💾 Player guardado localmente:", player.name);
      onSelect?.(player);
      return;
    }

    try {
      // Usuario logueado → guarda en backend
      localStorage.setItem("selectedPlayer", player.id);

      const response = await addPlayer(userEmail, player.id);
      console.log("✅ Player asignado con éxito:", response);
      onSelect?.(player);
    } catch (error) {
      console.error("Error al asignar el Player:", error);
      alert("Error al asignar el Player, intenta de nuevo.");
    }
  };

  return (
    <div className="select-guide-container">
      <div className="select-guide-overlay" />
      <div className="guide-selection">
        <h1 className="choose-title">Elige tu personaje</h1>

        <div className="guide-options">
          {players.map((p) => (
            <div
              key={p.id}
              className="guide-card"
              style={{ backgroundColor: p.color }}
              onClick={() => handleSelect(p)}
            >
              <span className="guide-icon">{p.icon}</span>
              <h3>{p.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
