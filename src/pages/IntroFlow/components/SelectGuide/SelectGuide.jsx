import React, { useEffect, useRef, useState } from "react";
import "./SelectGuide.css";
import { addGuide } from "../../../../services/userService";

export default function SelectGuide({ onSelect }) {
  const announcerRef = useRef(null);
  const titleRef      = useRef(null);
  const [selectingId, setSelectingId] = useState(null);

  const guides = [
    {
      id: 1,
      name: "Lili",
      color: "#ffeaee82",
      icon: "/assets/guides/girl.png",
    },
    {
      id: 2,
      name: "Nick",
      color: "#bfdebbff",
      icon: "/assets/guides/boy.png",
    },
    {
      id: 3,
      name: "Andrew",
      color: "#e1dcefff",
      icon: "/assets/guides/nb.png",
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
      `Hay ${guides.length} opciones. Presiona Tab para pasar de una a otra, y presiona Enter para elegir. Tu guía te acompañará durante la introducción.`
    );
    return () => clearTimeout(focusId);
  }, []);

  const handleSelect = async (guide) => {
    if (selectingId) return;

    const userEmail = localStorage.getItem("userEmail");
    setSelectingId(guide.id);
    announce(`Eligiendo a ${guide.name}. Espera un momento.`);

    try {
      if (userEmail) {
        await addGuide(userEmail, guide.id);
      } else {
        localStorage.setItem("selectedGuide", guide.id);
      }

      onSelect?.(guide);
    } catch (error) {
      setSelectingId(null);
      announce(`No se pudo guardar a ${guide.name} como tu guía. Vuelve a presionar Enter sobre la tarjeta para intentarlo de nuevo.`);
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

      <div className="select-guide-overlay" aria-hidden="true" />

      <div
        className="guide-selection"
        role="main"
        aria-labelledby="choose-title"
        aria-describedby="guide-instructions"
      >
        <h1
          id="choose-title"
          className="choose-title"
          ref={titleRef}
          tabIndex={-1}
        >
          Elige tu guía
        </h1>
        <p id="guide-instructions" className="sr-only">
          Hay {guides.length} opciones. Presiona Tab para pasar de una a otra, y presiona Enter para seleccionar.
          Tu guía te acompañará durante la introducción.
        </p>

        <div
          className="guide-options"
          role="group"
          aria-label="Opciones de guía"
        >
          {guides.map((g, index) => {
            const isSelecting = selectingId === g.id;
            const isDisabled  = selectingId !== null && !isSelecting;
            const isLast      = index === guides.length - 1;

            return (
              <div key={g.id}>
                 <button
                  className="guide-card"
                  style={{ backgroundColor: g.color }}
                  onClick={() => handleSelect(g)}
                  onFocus={() =>
                    !selectingId &&
                    announce(
                      `${g.name}, opción ${index + 1} de ${guides.length}. Presiona Enter para seleccionar` +
                        (isLast ? "." : ", o Tab para ver la siguiente opción.")
                    )
                  }
                  aria-label={
                    isSelecting
                      ? `Guardando tu elección: ${g.name}. Espera un momento.`
                      : `Seleccionar a ${g.name} como tu guía`
                  }
                  aria-busy={isSelecting}
                  disabled={isDisabled}
                >
                  <img src={g.icon} alt="" aria-hidden="true" className="guide-icon" />
                </button>
                <h3 className="guide-name" aria-hidden="true">{g.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}