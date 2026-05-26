import React, { useEffect, useRef } from "react";
import "./SelectPlayer.css";
import { addPlayer } from "../../../../services/userService";

export default function SelectPlayer({ onSelect }) {
  const announcerRef = useRef(null);

  const players = [
    { id: 1, name: "Femenino", color: "#f0e1e3ff", icon: "/assets/players/girl.png", description: "Personaje Femenino" },
    { id: 2, name: "Masculino", color: "#b5c0d6ff", icon: "/assets/players/boy.png", description: "Personaje Masculino" },
    { id: 3, name: "No-Binario", color: "#bfd18cff", icon: "/assets/players/nb.png", description: "Personaje No-Binario" },
  ];

  const announce = (text) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = "";
      setTimeout(() => {
        announcerRef.current.textContent = text;
      }, 50);
    }
  };

  useEffect(() => {
    announce("Elige tu personaje. Usa Tab para explorar las opciones.");
  }, []);

  const handleSelect = async (player) => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      localStorage.setItem("selectedPlayer", player.id);
      onSelect?.(player);
      return;
    }

    try {
      localStorage.setItem("selectedPlayer", player.id);
      await addPlayer(userEmail, player.id);
      onSelect?.(player);
    } catch (error) {
      announce("Error al asignar el personaje, intenta de nuevo.");
    }
  };

  return (
    <div className="select-guide-container">
      <div
        ref={announcerRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
        }}
      />

      <div className="select-guide-overlay" />

      <div
        className="guide-selection"
        role="main"
        aria-labelledby="choose-title"
      >
        <h1 id="choose-title" className="choose-title">
          Elige tu personaje
        </h1>

        <div
          className="guide-options"
          role="group"
          aria-label="Opciones de personaje"
        >
          {players.map((p) => (
            <div key={p.id}>
              <button
                className="guide-card"
                style={{ backgroundColor: p.color }}
                onClick={() => handleSelect(p)}
                onFocus={() => announce(`${p.description}. Presiona Enter para seleccionar.`)}
                aria-label={`Seleccionar ${p.description}`}
              >
                <img src={p.icon} alt="" aria-hidden="true" className="guide-icon" />
              </button>
              <h3 className="guide-name" aria-hidden="true">{p.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}