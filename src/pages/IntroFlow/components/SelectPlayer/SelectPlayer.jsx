import React, { useEffect, useRef, useState } from "react";
import "./SelectPlayer.css";
import { addPlayer } from "../../../../services/userService";

export default function SelectPlayer({ onSelect }) {
  const announcerRef = useRef(null);
  const titleRef      = useRef(null);
  const [selectingId, setSelectingId] = useState(null);

  const players = [
    {
      id: 1,
      name: "Femenino",
      color: "#f0e1e3ff",
      icon: "/assets/players/girl.png",
      description: "Personaje Femenino",
    },
    {
      id: 2,
      name: "Masculino",
      color: "#b5c0d6ff",
      icon: "/assets/players/boy.png",
      description: "Personaje Masculino",
    },
    {
      id: 3,
      name: "No-Binario",
      color: "#bfd18cff",
      icon: "/assets/players/nb.png",
      description: "Personaje No-Binario",
    },
  ];

  const announce = (text) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = "";
      setTimeout(() => {
        if (announcerRef.current) announcerRef.current.textContent = text;
      }, 50);
    }
  };

  useEffect(() => {
    const focusId = setTimeout(() => titleRef.current?.focus(), 100);
    announce(
      `Hay ${players.length} opciones. Presiona Tab para pasar de una a otra, y presiona Enter para elegir. Tu personaje te acompañará durante el juego.`
    );
    return () => clearTimeout(focusId);
  }, []);

  const handleSelect = async (player) => {
    if (selectingId) return;

    const userEmail = localStorage.getItem("userEmail");
    setSelectingId(player.id);
    announce(`Eligiendo ${player.description}. Espera un momento.`);

    try {
      localStorage.setItem("selectedPlayer", player.id);

      if (userEmail) {
        await addPlayer(userEmail, player.id);
      }

      onSelect?.(player);
    } catch (error) {
      setSelectingId(null);
      announce(
        `No se pudo guardar ${player.description} como tu personaje. Vuelve a presionar Enter sobre la tarjeta para intentarlo de nuevo.`
      );
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

      <div className="select-guide-overlay" aria-hidden="true" />

      <div
        className="guide-selection"
        role="main"
        aria-labelledby="choose-title"
        aria-describedby="player-instructions"
      >
        <h1
          id="choose-title"
          className="choose-title"
          ref={titleRef}
          tabIndex={-1}
        >
          Elige tu personaje
        </h1>
        <p id="player-instructions" className="sr-only">
          Hay {players.length} opciones. Presiona Tab para pasar de una a otra, y presiona Enter para seleccionar.
          Tu personaje te acompañará durante el juego.
        </p>

        <div
          className="guide-options"
          role="group"
          aria-label="Opciones de personaje"
        >
          {players.map((p, index) => {
            const isSelecting = selectingId === p.id;
            const isDisabled  = selectingId !== null && !isSelecting;
            const isLast      = index === players.length - 1;

            return (
              <div key={p.id}>
                <button
                  className="guide-card"
                  style={{ backgroundColor: p.color }}
                  onClick={() => handleSelect(p)}
                  onFocus={() =>
                    !selectingId &&
                    announce(
                      `${p.description}, opción ${index + 1} de ${players.length}. Presiona Enter para seleccionar` +
                        (isLast ? "." : ", o Tab para ver la siguiente opción.")
                    )
                  }
                  aria-label={
                    isSelecting
                      ? `Guardando tu elección: ${p.description}. Espera un momento.`
                      : `Seleccionar ${p.description}`
                  }
                  aria-busy={isSelecting}
                  disabled={isDisabled}
                >
                  <img src={p.icon} alt="" aria-hidden="true" className="guide-icon" />
                </button>
                <h3 className="guide-name" aria-hidden="true">{p.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}