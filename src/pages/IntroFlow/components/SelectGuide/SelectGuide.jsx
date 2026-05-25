import React, { useEffect, useRef } from "react";
import "./SelectGuide.css";
import { addGuide } from "../../../../services/userService";

export default function SelectGuide({ onSelect }) {
  const announcerRef = useRef(null);

  const guides = [
    {
      id: 1,
      name: "Lili",
      color: "#ffeaee82",
      icon: "/assets/guides/girl.png",
      description: "Lili, guía aventurera",
    },
    {
      id: 2,
      name: "Nick",
      color: "#bfdebbff",
      icon: "/assets/guides/boy.png",
      description: "Nick, explorador curioso",
    },
    {
      id: 3,
      name: "Andrew",
      color: "#e1dcefff",
      icon: "/assets/guides/nb.png",
      description: "Andrew, compañero de viaje",
    },
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
    announce("Elige tu guía. Usa Tab para explorar las opciones.");
  }, []);

  const handleSelect = async (guide) => {
    const userEmail = localStorage.getItem("userEmail");
    try {
      if (userEmail) {
        await addGuide(userEmail, guide.id);
      } else {
        localStorage.setItem("selectedGuide", guide.id);
      }
      onSelect?.(guide);
    } catch (error) {
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const pendingGuideId = localStorage.getItem("selectedGuide");
    if (userId && pendingGuideId) {
      addGuide(userId, pendingGuideId)
        .then(() => localStorage.removeItem("selectedGuide"))
        .catch((err) => console.error("Error sincronizando guía:", err));
    }
  }, []);

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
          Elige tu guía
        </h1>

        <div
          className="guide-options"
          role="group"
          aria-label="Opciones de guía"
        >
          {guides.map((g) => (
            <div key={g.id}>
              <button
                className="guide-card"
                style={{ backgroundColor: g.color }}
                onClick={() => handleSelect(g)}
                onFocus={() => announce(`${g.description}. Presiona Enter para seleccionar.`)}
                aria-label={`Seleccionar a ${g.description}`}
              >
                <img src={g.icon} alt="" aria-hidden="true" className="guide-icon" />
              </button>
              <h3 className="guide-name" aria-hidden="true">{g.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}