import { useState } from "react";
import Swal from "sweetalert2";
import ConfettiEffect from "../../../ui/Confetti";
import GameCompleteModal from "../../../ui/GameCompleteModal/GameCompleteModal";
import "./LiteraturaGame.css";

const STORY_FRAGMENTS = {
  inicio: [
    { id: 1, text: "Un joven explorador que soñaba con descubrir lugares secretos", type: "inicio" },
    { id: 2, text: "Una niña curiosa que hacía preguntas sobre todo lo que veía", type: "inicio" },
    { id: 3, text: "Un detective astuto que resolvía misterios en su ciudad", type: "inicio" },
  ],
  desarrollo: [
    { id: 4, text: "Un día encontró un mapa misterioso que cambiaría su destino", type: "desarrollo" },
    { id: 5, text: "Se enfrentó a grandes desafíos y superó todos los obstáculos", type: "desarrollo" },
    { id: 6, text: "Conoció a un aliado inesperado que lo ayudaría en su misión", type: "desarrollo" },
  ],
  final: [
    { id: 7, text: "Finalmente logró su objetivo y aprendió una valiosa lección", type: "final" },
    { id: 8, text: "Descubrió una verdad que cambió su vida para siempre", type: "final" },
    { id: 9, text: "Se convirtió en un héroe y compartió su sabiduría con otros", type: "final" },
  ],
};

export default function LiteraturaGame({ onComplete }) {
  const [currentPhase, setCurrentPhase] = useState("inicio");
  const [selections, setSelections] = useState({
    inicio: null,
    desarrollo: null,
    final: null,
  });
  const [gameFinished, setGameFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showStoryModal, setShowStoryModal] = useState(false);

  const handleDragStart = (e, fragment) => {
    setDraggedItem(fragment);
    e.dataTransfer.setData("text/plain", JSON.stringify(fragment));
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, zoneType) => {
    e.preventDefault();
    
    let fragment;
    try {
      fragment = JSON.parse(e.dataTransfer.getData("text/plain"));
    } catch (error) {
      fragment = draggedItem;
    }

    if (!fragment) return;

    if (zoneType !== currentPhase) {
      Swal.fire({
        title: "¡Espera! 📖",
        text: `Primero completa la parte de "${currentPhase.toUpperCase()}"`,
        icon: "warning",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    if (fragment.type !== zoneType) {
      Swal.fire({
        title: "¡Fragmento incorrecto!",
        text: `Este fragmento pertenece a "${fragment.type.toUpperCase()}"`,
        icon: "error",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    if (selections[zoneType] !== null) {
      Swal.fire({
        title: "Ya elegiste tu opción",
        text: `Ya seleccionaste un fragmento para ${zoneType.toUpperCase()}`,
        icon: "info",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    setSelections(prev => ({
      ...prev,
      [zoneType]: fragment
    }));

    if (currentPhase === "inicio") {
      Swal.fire({
        title: "¡Bien hecho!",
        text: "Ahora arrastra un fragmento para el DESARROLLO",
        icon: "success",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
        timer: 1500,
        showConfirmButton: false,
      });
      setCurrentPhase("desarrollo");
    } else if (currentPhase === "desarrollo") {
      Swal.fire({
        title: "¡Vamos bien!",
        text: "Último paso: arrastra un fragmento para el FINAL",
        icon: "success",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
        timer: 1500,
        showConfirmButton: false,
      });
      setCurrentPhase("final");
    } else if (currentPhase === "final") {

      setShowStoryModal(true);
    }
  };

  const getAvailableFragments = () => {
    const allFragments = STORY_FRAGMENTS[currentPhase];
    const selectedFragment = selections[currentPhase];
    return allFragments.filter(f => !selectedFragment || f.id !== selectedFragment.id);
  };

  const handleCloseStoryModal = () => {
    setShowStoryModal(false);
    setGameFinished(true);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };

  if (gameFinished) {
    return (
      <>
        {showConfetti && <ConfettiEffect />}
        <GameCompleteModal
          title="¡Historia completada!"
          message="¡Excelente! Has creado una historia maravillosa. ¡Eres un gran escritor!"
          onContinue={onComplete}
        />
      </>
    );
  }

  return (
    <div className="literatura-overlay">
      <div className="literatura-panel">

        <div className="literatura-header">
          <img src="/assets/ui/Literatura/litPerson.png" className="literatura-npc" alt="NPC" />
          <div className="literatura-bubble">
            <p>Ayúdame a construir una historia</p>
            <small>Arrastra UN fragmento a cada zona</small>
          </div>
        </div>

        
        <div className="phase-indicator">
          <div className={`phase-step ${currentPhase === "inicio" ? "active" : selections.inicio ? "completed" : ""}`}>
            Inicio {selections.inicio && "✓"}
          </div>
          <div className={`phase-step ${currentPhase === "desarrollo" ? "active" : selections.desarrollo ? "completed" : ""}`}>
            Desarrollo {selections.desarrollo && "✓"}
          </div>
          <div className={`phase-step ${currentPhase === "final" ? "active" : selections.final ? "completed" : ""}`}>
           Final {selections.final && "✓"}
          </div>
        </div>


        <div className="story-zones">
  
          <div 
            className={`story-zone ${currentPhase === "inicio" ? "active-zone" : ""}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "inicio")}
          >
            <h3>INICIO</h3>
            <div className="zone-content">
              {selections.inicio ? (
                <div className="placed-fragment">
                  {selections.inicio.text}
                </div>
              ) : (
                <div className="empty-zone">
                  {currentPhase === "inicio" ? "Arrastra aquí tu fragmento" : "Esperando..."}
                </div>
              )}
            </div>
          </div>

          <div 
            className={`story-zone ${currentPhase === "desarrollo" ? "active-zone" : ""}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "desarrollo")}
          >
            <h3>DESARROLLO</h3>
            <div className="zone-content">
              {selections.desarrollo ? (
                <div className="placed-fragment">
                  {selections.desarrollo.text}
                </div>
              ) : (
                <div className="empty-zone">
                  {currentPhase === "desarrollo" ? "Arrastra aquí tu fragmento" : selections.inicio ? "Esperando..." : "Bloqueado"}
                </div>
              )}
            </div>
          </div>

          <div 
            className={`story-zone ${currentPhase === "final" ? "active-zone" : ""}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "final")}
          >
            <h3>FINAL</h3>
            <div className="zone-content">
              {selections.final ? (
                <div className="placed-fragment">
                  {selections.final.text}
                </div>
              ) : (
                <div className="empty-zone">
                  {currentPhase === "final" ? "Arrastra aquí tu fragmento" : selections.desarrollo ? "Esperando..." : "Bloqueado"}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="available-fragments">
          <h3>Fragmentos disponibles - {currentPhase.toUpperCase()}</h3>
          <div className="fragments-grid">
            {getAvailableFragments().map((fragment) => (
              <div
                key={fragment.id}
                className="fragment-card"
                draggable
                onDragStart={(e) => handleDragStart(e, fragment)}
                onDragEnd={handleDragEnd}
              >
                <span className="drag-icon">⋮⋮</span>
                {fragment.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showStoryModal && selections.inicio && selections.desarrollo && selections.final && (
        <div className="story-modal-overlay">
          <div className="story-modal">
            
            
            <div className="story-modal-content">
              <div className="story-modal-npc">
                <img src="/assets/ui/Psicologia/person4.png" alt="NPC feliz" />
                <div className="story-modal-bubble">
                  <p className="reaction-text">¡Wow! ¡Qué historia tan fascinante!</p>
                  <p className="reaction-subtext">Me encantó cómo la construiste</p>
                </div>
              </div>

              <div className="story-modal-book">
                <h2>La historia que creaste</h2>
                <div className="complete-story">
                  <div className="story-part inicio-part">
                    <span className="story-label">INICIO</span>
                    <p>{selections.inicio.text}</p>
                  </div>
                  <div className="story-part desarrollo-part">
                    <span className="story-label">DESARROLLO</span>
                    <p>{selections.desarrollo.text}</p>
                  </div>
                 
                  <div className="story-part final-part">
                    <span className="story-label">FINAL</span>
                    <p>{selections.final.text}</p>
                  </div>
                </div>
              </div>

              <button className="story-modal-btn" onClick={handleCloseStoryModal}>
               Terminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}