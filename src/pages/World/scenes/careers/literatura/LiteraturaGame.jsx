import { useState } from "react";
import ConfettiEffect from "../../../ui/Confetti";
import GameCompleteModal from "../../../ui/GameCompleteModal/GameCompleteModal";
import "./LiteraturaGame.css";

/* 📚 DATA */

const STORY_OPTIONS = {
  inicio: [
    {
      id: 1,
      text: "Un joven explorador que soñaba con descubrir lugares secretos.",
    },
    {
      id: 2,
      text: "Una niña curiosa que hacía preguntas sobre todo.",
    },
    {
      id: 3,
      text: "Un detective que resolvía misterios en su ciudad.",
    },
  ],
  desarrollo: [
    {
      id: 4,
      text: "Un día encontró algo inesperado que cambió su destino.",
    },
    {
      id: 5,
      text: "Se enfrentó a grandes desafíos en su camino.",
    },
  ],
  final: [
    {
      id: 6,
      text: "Finalmente logró su objetivo y aprendió algo importante.",
    },
    {
      id: 7,
      text: "Descubrió una verdad que cambió su vida.",
    },
  ],
};

export default function LiteraturaGame({ onComplete }) {
  const [fase, setFase] = useState("inicio");
  const [gameFinished, setGameFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [zones, setZones] = useState({
    inicio: [],
    desarrollo: [],
    final: [],
  });

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("item", JSON.stringify(item));
  };

  const handleDrop = (e, zone) => {
    e.preventDefault();

    if (zone !== fase) {
      alert("Primero completa la parte anterior 👀");
      return;
    }

    const item = JSON.parse(e.dataTransfer.getData("item"));

    if (zones[zone].some((i) => i.id === item.id)) return;

    setZones((prev) => ({
      ...prev,
      [zone]: [...prev[zone], item],
    }));

    if (fase === "inicio") setFase("desarrollo");
    else if (fase === "desarrollo") setFase("final");
  };

  const handleContinue = () => {
    if (
      !zones.inicio.length ||
      !zones.desarrollo.length ||
      !zones.final.length
    ) {
      return alert("Completa la historia 😅");
    }

    setGameFinished(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  if (gameFinished) {
    return (
      <div className="overlay">
        {showConfetti && <ConfettiEffect />}

        <GameCompleteModal
          title="📚 ¡Excelente!"
          message="Has construido correctamente la historia."
          onContinue={onComplete}
        />
      </div>
    );
  }

  return (
    <div className="overlay">
      <div className="panel literatura">
        <div className="npc-container">
          <img src="/assets/ui/Literatura/npc.png" className="npc-img" />

          <div className="bubble">
            Ayúdame a crear una historia para mi próximo libro 📚
          </div>
        </div>

        <h2 className="title">Construye la historia</h2>
        <p className="subtitle">
          Arrastra cada fragmento en orden: inicio → desarrollo → final
        </p>

        <div className="story-zones">
          <div
            className={`zone ${fase === "inicio" ? "active" : "locked"}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, "inicio")}
          >
            <h3>Inicio</h3>
            {zones.inicio.map((item) => (
              <div key={item.id} className="story-card small">
                {item.text}
              </div>
            ))}
          </div>

          <div
            className={`zone ${fase === "desarrollo" ? "active" : "locked"}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, "desarrollo")}
          >
            <h3>Desarrollo</h3>
            {zones.desarrollo.map((item) => (
              <div key={item.id} className="story-card small">
                {item.text}
              </div>
            ))}
          </div>

          <div
            className={`zone ${fase === "final" ? "active" : "locked"}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, "final")}
          >
            <h3>Final</h3>
            {zones.final.map((item) => (
              <div key={item.id} className="story-card small">
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div className="story-options">
          {STORY_OPTIONS[fase].map((item) => (
            <div
              key={item.id}
              className="story-card"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              {item.text}
            </div>
          ))}
        </div>

        <button className="btn" onClick={handleContinue}>
          CONTINUAR
        </button>
      </div>
    </div>
  );
}