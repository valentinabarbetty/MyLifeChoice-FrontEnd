import { useState, useRef, useEffect } from "react";
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
  const [focusedFragment, setFocusedFragment] = useState(null);
  
  const zoneRefs = {
    inicio: useRef(null),
    desarrollo: useRef(null),
    final: useRef(null),
  };

  useEffect(() => {
    const phaseMessages = {
      inicio: "Puedes seleccionar un fragmento para el inicio de la historia",
      desarrollo: "Ahora selecciona un fragmento para el desarrollo",
      final: "Último paso: selecciona un fragmento para el final de la historia"
    };
    
    const message = phaseMessages[currentPhase];
    if (message) {
      const announcer = document.getElementById("status-announcer");
      if (announcer) {
        announcer.textContent = message;
      }
    }
  }, [currentPhase]);

  useEffect(() => {
    if (showStoryModal) {
      const modal = document.querySelector('.story-modal');
      if (modal) {
        modal.focus();
      }
      
      const announcer = document.getElementById("status-announcer");
      if (announcer) {
        announcer.textContent = "¡Has completado la historia! Revisa tu historia creada y presiona el botón Terminar para continuar.";
      }
      
      document.body.style.overflow = "hidden";
      
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [showStoryModal]);

  const handleDragStart = (e, fragment) => {
    setDraggedItem(fragment);
    e.dataTransfer.setData("text/plain", JSON.stringify(fragment));
    e.dataTransfer.effectAllowed = "copy";
    e.target.style.opacity = "0.5";
    
    const announcer = document.getElementById("status-announcer");
    if (announcer) {
      announcer.textContent = `Arrastrando: ${fragment.text}`;
    }
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
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

    const announcer = document.getElementById("status-announcer");
    if (announcer) {
      announcer.textContent = `Has seleccionado: ${fragment.text} para ${zoneType.toUpperCase()}`;
    }

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
      setTimeout(() => {
        zoneRefs.desarrollo.current?.focus();
      }, 100);
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
      setTimeout(() => {
        zoneRefs.final.current?.focus();
      }, 100);
    } else if (currentPhase === "final") {
      setShowStoryModal(true);
    }
  };

  const handleKeyDown = (e, fragment, zoneType) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      
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

      const announcer = document.getElementById("status-announcer");
      if (announcer) {
        announcer.textContent = `Has seleccionado: ${fragment.text} para ${zoneType.toUpperCase()}`;
      }

      if (currentPhase === "inicio") {
        Swal.fire({
          title: "¡Bien hecho!",
          text: "Ahora selecciona un fragmento para el DESARROLLO",
          icon: "success",
          confirmButtonColor: "#22c55e",
          background: "#fef7e7",
          timer: 1500,
          showConfirmButton: false,
        });
        setCurrentPhase("desarrollo");
        setTimeout(() => {
          zoneRefs.desarrollo.current?.focus();
        }, 100);
      } else if (currentPhase === "desarrollo") {
        Swal.fire({
          title: "¡Vamos bien!",
          text: "Último paso: selecciona un fragmento para el FINAL",
          icon: "success",
          confirmButtonColor: "#22c55e",
          background: "#fef7e7",
          timer: 1500,
          showConfirmButton: false,
        });
        setCurrentPhase("final");
        setTimeout(() => {
          zoneRefs.final.current?.focus();
        }, 100);
      } else if (currentPhase === "final") {
        setShowStoryModal(true);
      }
    }
  };

  const handleKeyboardDrop = (e, zoneType) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const announcer = document.getElementById("status-announcer");
      if (announcer) {
        announcer.textContent = `Zona ${zoneType.toUpperCase()} activa. Arrastra un fragmento o selecciona uno de la lista.`;
      }
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
    
    const announcer = document.getElementById("status-announcer");
    if (announcer) {
      announcer.textContent = "¡Felicidades! Has completado la historia. ¡Eres un gran escritor!";
    }
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };
  const handleModalKeyDown = (e) => {
    if (e.key === "Escape" && showStoryModal) {
      handleCloseStoryModal();
    }
  };

  if (gameFinished) {
    return (
      <>
        {showConfetti && <ConfettiEffect />}
        <div role="status" aria-live="polite" id="status-announcer" className="sr-only"></div>
        <GameCompleteModal
          title="¡Historia completada!"
          message="¡Excelente! Has creado una historia maravillosa. ¡Eres un gran escritor!"
          onContinue={onComplete}
        />
      </>
    );
  }

  return (
    <div 
      className="literatura-overlay"
      role="main"
      aria-label="Juego de construcción de historias"
    >
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        id="status-announcer" 
        className="sr-only"
      ></div>

      <div 
        className="literatura-panel"
        role="region"
        aria-label="Panel del juego"
      >
        <div className="literatura-header">
          <img 
            src="/assets/ui/Literatura/litPerson.png" 
            className="literatura-npc" 
            alt="Personaje guía que te ayudará a construir una historia"
            aria-label="Personaje guía"
          />
          <div 
            className="literatura-bubble"
            role="complementary"
            aria-label="Instrucciones del personaje"
          >
            <p>Ayúdame a construir una historia</p>
            <small>Arrastra UN fragmento a cada zona (también puedes usar Enter o Espacio)</small>
          </div>
        </div>
        <div 
          className="phase-indicator"
          role="group"
          aria-label="Progreso de la historia"
        >
          <div 
            className={`phase-step ${currentPhase === "inicio" ? "active" : selections.inicio ? "completed" : ""}`}
            aria-current={currentPhase === "inicio" ? "step" : undefined}
            aria-label={`Inicio ${selections.inicio ? "completado" : currentPhase === "inicio" ? "activo" : "pendiente"}`}
          >
            Inicio {selections.inicio && <span aria-label="Completado">✓</span>}
          </div>
          <div 
            className={`phase-step ${currentPhase === "desarrollo" ? "active" : selections.desarrollo ? "completed" : ""}`}
            aria-current={currentPhase === "desarrollo" ? "step" : undefined}
            aria-label={`Desarrollo ${selections.desarrollo ? "completado" : currentPhase === "desarrollo" ? "activo" : "pendiente"}`}
          >
            Desarrollo {selections.desarrollo && <span aria-label="Completado">✓</span>}
          </div>
          <div 
            className={`phase-step ${currentPhase === "final" ? "active" : selections.final ? "completed" : ""}`}
            aria-current={currentPhase === "final" ? "step" : undefined}
            aria-label={`Final ${selections.final ? "completado" : currentPhase === "final" ? "activo" : "pendiente"}`}
          >
            Final {selections.final && <span aria-label="Completado">✓</span>}
          </div>
        </div>
        <div 
          className="story-zones"
          role="group"
          aria-label="Zonas para colocar fragmentos de la historia"
        >
          <div 
            ref={zoneRefs.inicio}
            className={`story-zone ${currentPhase === "inicio" ? "active-zone" : ""}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "inicio")}
            tabIndex={currentPhase === "inicio" ? 0 : -1}
            role="button"
            aria-label={`Zona de INICIO ${currentPhase === "inicio" ? "activa - puedes colocar fragmentos aquí" : selections.inicio ? "completada" : "bloqueada"}`}
            onKeyDown={(e) => currentPhase === "inicio" && handleKeyboardDrop(e, "inicio")}
            aria-disabled={currentPhase !== "inicio"}
          >
            <h3 id="inicio-title">INICIO</h3>
            <div className="zone-content" aria-labelledby="inicio-title">
              {selections.inicio ? (
                <div 
                  className="placed-fragment"
                  aria-label={`Fragmento seleccionado: ${selections.inicio.text}`}
                >
                  {selections.inicio.text}
                </div>
              ) : (
                <div 
                  className="empty-zone"
                  aria-label={currentPhase === "inicio" ? "Zona vacía, arrastra o presiona Enter para seleccionar un fragmento" : "Esperando turno"}
                >
                  {currentPhase === "inicio" ? "Arrastra aquí tu fragmento" : "Esperando..."}
                </div>
              )}
            </div>
          </div>

          <div 
            ref={zoneRefs.desarrollo}
            className={`story-zone ${currentPhase === "desarrollo" ? "active-zone" : ""}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "desarrollo")}
            tabIndex={currentPhase === "desarrollo" ? 0 : -1}
            role="button"
            aria-label={`Zona de DESARROLLO ${currentPhase === "desarrollo" ? "activa - puedes colocar fragmentos aquí" : selections.desarrollo ? "completada" : "bloqueada"}`}
            onKeyDown={(e) => currentPhase === "desarrollo" && handleKeyboardDrop(e, "desarrollo")}
            aria-disabled={currentPhase !== "desarrollo"}
          >
            <h3 id="desarrollo-title">DESARROLLO</h3>
            <div className="zone-content" aria-labelledby="desarrollo-title">
              {selections.desarrollo ? (
                <div 
                  className="placed-fragment"
                  aria-label={`Fragmento seleccionado: ${selections.desarrollo.text}`}
                >
                  {selections.desarrollo.text}
                </div>
              ) : (
                <div 
                  className="empty-zone"
                  aria-label={currentPhase === "desarrollo" ? "Zona vacía, arrastra o presiona Enter para seleccionar un fragmento" : selections.inicio ? "Esperando turno" : "Necesitas completar el inicio primero"}
                >
                  {currentPhase === "desarrollo" ? "Arrastra aquí tu fragmento" : selections.inicio ? "Esperando..." : "Bloqueado"}
                </div>
              )}
            </div>
          </div>

          <div 
            ref={zoneRefs.final}
            className={`story-zone ${currentPhase === "final" ? "active-zone" : ""}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "final")}
            tabIndex={currentPhase === "final" ? 0 : -1}
            role="button"
            aria-label={`Zona de FINAL ${currentPhase === "final" ? "activa - puedes colocar fragmentos aquí" : selections.final ? "completada" : "bloqueada"}`}
            onKeyDown={(e) => currentPhase === "final" && handleKeyboardDrop(e, "final")}
            aria-disabled={currentPhase !== "final"}
          >
            <h3 id="final-title">FINAL</h3>
            <div className="zone-content" aria-labelledby="final-title">
              {selections.final ? (
                <div 
                  className="placed-fragment"
                  aria-label={`Fragmento seleccionado: ${selections.final.text}`}
                >
                  {selections.final.text}
                </div>
              ) : (
                <div 
                  className="empty-zone"
                  aria-label={currentPhase === "final" ? "Zona vacía, arrastra o presiona Enter para seleccionar un fragmento" : selections.desarrollo ? "Esperando turno" : "Necesitas completar el desarrollo primero"}
                >
                  {currentPhase === "final" ? "Arrastra aquí tu fragmento" : selections.desarrollo ? "Esperando..." : "Bloqueado"}
                </div>
              )}
            </div>
          </div>
        </div>
        <div 
          className="available-fragments"
          role="region"
          aria-label={`Fragmentos disponibles para ${currentPhase.toUpperCase()}`}
        >
          <h3 id="fragments-title">Fragmentos disponibles - {currentPhase.toUpperCase()}</h3>
          <div 
            className="fragments-grid"
            role="listbox"
            aria-label="Lista de fragmentos para seleccionar"
            aria-labelledby="fragments-title"
          >
            {getAvailableFragments().map((fragment, index) => (
              <div
                key={fragment.id}
                className="fragment-card"
                draggable
                onDragStart={(e) => handleDragStart(e, fragment)}
                onDragEnd={handleDragEnd}
                tabIndex={0}
                role="option"
                aria-label={`Fragmento ${index + 1}: ${fragment.text}. Presiona Enter o Espacio para seleccionarlo`}
                onKeyDown={(e) => handleKeyDown(e, fragment, currentPhase)}
                aria-selected={focusedFragment === fragment.id}
              >
                <span className="drag-icon" aria-hidden="true">⋮⋮</span>
                {fragment.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showStoryModal && selections.inicio && selections.desarrollo && selections.final && (
        <div 
          className="story-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="story-modal-title"
          aria-describedby="story-modal-description"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseStoryModal();
          }}
        >
          <div 
            className="story-modal"
            role="document"
            tabIndex={-1}
            onKeyDown={handleModalKeyDown}
          >
            <div className="story-modal-content">
              <div 
                className="sr-only" 
                aria-live="assertive" 
                role="alert"
                id="story-modal-description"
              >
                Modal abierto. Has completado tu historia. El inicio dice: {selections.inicio.text}. 
                El desarrollo dice: {selections.desarrollo.text}. 
                El final dice: {selections.final.text}. 
                Presiona el botón Terminar para continuar.
              </div>

              <div className="story-modal-npc">
                <img 
                  src="/assets/ui/Psicologia/person4.png" 
                  alt="Personaje feliz celebrando tu historia"
                  aria-label="Personaje celebrando tu historia"
                />
                <div className="story-modal-bubble">
                  <p className="reaction-text">¡Wow! ¡Qué historia tan fascinante!</p>
                  <p className="reaction-subtext">Me encantó cómo la construiste</p>
                </div>
              </div>

              <div className="story-modal-book">
                <h2 id="story-modal-title" tabIndex={-1}>La historia que creaste</h2>
                
                <div 
                  className="complete-story"
                  role="article"
                  aria-label="Historia completa creada por ti"
                >
                  <div className="story-part inicio-part">
                    <span className="story-label" id="story-inicio-label">INICIO</span>
                    <p 
                      aria-labelledby="story-inicio-label"
                      tabIndex={0}
                    >
                      {selections.inicio.text}
                    </p>
                  </div>
                  <div className="story-part desarrollo-part">
                    <span className="story-label" id="story-desarrollo-label">DESARROLLO</span>
                    <p 
                      aria-labelledby="story-desarrollo-label"
                      tabIndex={0}
                    >
                      {selections.desarrollo.text}
                    </p>
                  </div>
                  <div className="story-part final-part">
                    <span className="story-label" id="story-final-label">FINAL</span>
                    <p 
                      aria-labelledby="story-final-label"
                      tabIndex={0}
                    >
                      {selections.final.text}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                className="story-modal-btn" 
                onClick={handleCloseStoryModal}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCloseStoryModal();
                  }
                }}
                aria-label="Terminar y cerrar la historia"
                autoFocus
              >
                Terminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}