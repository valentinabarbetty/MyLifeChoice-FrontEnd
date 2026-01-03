import React, { useEffect } from "react";
import "./SelectGuide.css";
import { addGuide } from "../../../../services/userService";
//import "../../../../../public/assets/images/girl.png"

export default function SelectGuide({ onSelect }) {
  const guides = [
    { id: 1, name: "Lili", color: "#ffeaee82", icon: "/assets/guides/girl.png" },
    { id: 2, name: "Nick", color: "#bfdebbff", icon: "/assets/guides/boy.png" },
    { id: 3, name: "Andrew", color: "#e1dcefff", icon: "/assets/guides/nb.png" },
  ];
  const handleSelect = async (guide) => {
    const userEmail = localStorage.getItem("userEmail");
    
    try {
      if (userEmail) {
        // Si ya hay sesión, guarda en backend
        const response = await addGuide(userEmail, guide.id);
        console.log("✅ Guía asignada con éxito:", response);
      } else {
        // Si no hay sesión, guarda localmente
        localStorage.setItem("selectedGuide", guide.id);
        console.log("💾 Guía guardada localmente (sin usuario logueado)");
      }

      onSelect?.(guide);
    } catch (error) {
      console.error("Error al asignar guía:", error);
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
            <div>
            <div
              key={g.id}
              className="guide-card"
              style={{ backgroundColor: g.color }}
              onClick={() => handleSelect(g)}
            >
              <img src={g.icon} alt="" className="guide-icon"/>
              
            </div>
            <h3 className="guide-name">{g.name}</h3>
           </div>
          ))}
        </div>
      </div>
    </div>
  );
}
