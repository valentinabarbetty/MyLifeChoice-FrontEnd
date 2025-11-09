import React, { useEffect } from "react";
import "./SelectGuide.css";
import { addGuide } from "../../../../services/userService";

export default function SelectGuide({ onSelect }) {
  const guides = [
    { id: 1, name: "Lili", color: "#ffb6c1", icon: "🌸" },
    { id: 2, name: "Nick", color: "#6ecb63", icon: "🌿" },
    { id: 3, name: "Andrew", color: "#a18cd1", icon: "🌈" },
  ];
  const handleSelect = async (guide) => {
    const userId = localStorage.getItem("userId");
    localStorage.setItem("selectedGuide", guide.id);

    try {
      if (userId) {
        // Si ya hay sesión → guarda en backend
        const response = await addGuide(userId, guide.id);
        console.log("✅ Guía asignada con éxito:", response);
      } else {
        console.log("💾 Guía guardada localmente (sin usuario logueado)");
      }

      // 👉 Avanza igual al siguiente paso
      onSelect?.(guide);
    } catch (error) {
      console.error("Error al asignar la guía:", error);
      alert("Error al asignar la guía, intenta de nuevo.");
    }
  };

  // 🔁 Efecto: si el usuario inicia sesión luego y había guía pendiente, se sincroniza con backend
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const pendingGuideId = localStorage.getItem("selectedGuide");

    if (userId && pendingGuideId) {
      console.log("🔄 Sincronizando guía pendiente con backend...");

      addGuide(userId, pendingGuideId)
        .then((res) => {
          console.log("✅ Guía sincronizada correctamente:", res);
          localStorage.removeItem("selectedGuide");
        })
        .catch((err) => console.error("Error sincronizando guía:", err));
    }
  }, []);

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
