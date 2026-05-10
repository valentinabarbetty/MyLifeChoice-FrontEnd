import React from "react";
import "./SelectPlayer.css";
import { addPlayer } from "../../../../services/userService";
import { addGuide } from "../../../../services/userService";
export default function SelectPlayer({ onSelect }) {
  const players = [
    { id: 1, name: "Femenino", color: "#f0e1e3ff", icon: "/assets/players/girl.png" },
    { id: 2, name: "Masculino", color: "#b5c0d6ff", icon: "/assets/players/boy.png" },
    { id: 3, name: "No-Binario", color: "#bfd18cff", icon: "/assets/players/nb.png" },
  ];

  const handleSelect = async (player) => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      localStorage.setItem("selectedPlayer", player.id);
      console.log("Player guardado localmente:", player.name);
      onSelect?.(player);
      return;
    }

    try {
      localStorage.setItem("selectedPlayer", player.id);

      const response = await addPlayer(userEmail, player.id);
      console.log("Player asignado con éxito:", response);
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
            <div key={p.id}>
              <div
                
                className="guide-card"
                style={{ backgroundColor: p.color }}
                onClick={() => handleSelect(p)}
              >
                <img src={p.icon} alt="" className="guide-icon" />
              </div>
              <h3 className="guide-name">{p.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
