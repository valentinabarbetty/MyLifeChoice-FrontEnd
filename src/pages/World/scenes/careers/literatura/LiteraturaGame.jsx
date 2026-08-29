import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import ConfettiEffect from "../../../ui/Confetti";
import GameCompleteModal from "../../../ui/GameCompleteModal/GameCompleteModal";
import "./LiteraturaGame.css";

const STORY_FRAGMENTS = {
  inicio: [
    {
      id: 1,
      text: "Un joven explorador que soñaba con descubrir lugares secretos",
      type: "inicio",
    },
    {
      id: 2,
      text: "Una niña curiosa que hacía preguntas sobre todo lo que veía",
      type: "inicio",
    },
    {
      id: 3,
      text: "Un detective astuto que resolvía misterios en su ciudad",
      type: "inicio",
    },
  ],
  desarrollo: [
    {
      id: 4,
      text: "Un día encontró un mapa misterioso que cambiaría su destino",
      type: "desarrollo",
    },
    {
      id: 5,
      text: "Se enfrentó a grandes desafíos y superó todos los obstáculos",
      type: "desarrollo",
    },
    {
      id: 6,
      text: "Conoció a un aliado inesperado que lo ayudaría en su misión",
      type: "desarrollo",
    },
  ],
  final: [
    {
      id: 7,
      text: "Finalmente logró su objetivo y aprendió una valiosa lección",
      type: "final",
    },
    {
      id: 8,
      text: "Descubrió una verdad que cambió su vida para siempre",
      type: "final",
    },
    {
      id: 9,
      text: "Se convirtió en un héroe y compartió su sabiduría con otros",
      type: "final",
    },
  ],
};

const PHASE_LABEL = {
  inicio: "Inicio",
  desarrollo: "Desarrollo",
  final: "Final",
};

const GAME_TITLE = "Construye tu propia historia";

const GAME_INTRO_TEXT =
  `${GAME_TITLE}. Este es un juego de creación de historias. Debes ` +
  "construir una historia seleccionando un fragmento para el Inicio, " +
  "un fragmento para el Desarrollo y un fragmento para el Final. En " +
  "cada etapa encontrarás tres fragmentos. Debes escoger uno y " +
  "colocarlo en el área correspondiente para construir tu historia. " +
  "Utiliza Tab para avanzar entre las opciones y Shift más Tab para " +
  "regresar. Presiona Enter o Espacio para seleccionar un fragmento. " +
  "Una vez seleccionado, utiliza las flechas para moverlo y presiona " +
  "Enter o Espacio para colocarlo. Comenzaremos por el Inicio. Hay " +
  "tres fragmentos disponibles. Utiliza Tab para recorrerlos y " +
  "selecciona el que quieras utilizar para comenzar tu historia.";

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


  const [phaseAnnouncement, setPhaseAnnouncement] = useState("");

  const introRef = useRef(null);


  const firstFragmentRef = useRef(null);

  const phaseAnnouncerRef = useRef(null);

  const announce = (text) => {
    const announcer = document.getElementById("status-announcer");
    if (!announcer) return;
    announcer.textContent = "";
    requestAnimationFrame(() => {
      announcer.textContent = text;
    });
  };

  const showAccessibleAlert = async ({ icon, title, text }) => {
    const previouslyFocused = document.activeElement;

    const swalConfig = {
      title,
      text,
      icon,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#f59e0b",
      background: "#fef7e7",
      backdrop: "rgba(0,0,0,0.4)",
      allowOutsideClick: false,
      allowEscapeKey: true,
      showConfirmButton: true,
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        if (confirmButton) {
          confirmButton.focus();
          confirmButton.setAttribute("aria-label", `Cerrar alerta: ${title}`);
        }

        announce(`${title}. ${text}. Presiona Enter o Espacio para cerrar la alerta.`);

        const popup = Swal.getPopup();
        if (popup) {
          popup.setAttribute("role", "alertdialog");
          popup.setAttribute("aria-modal", "true");
          popup.setAttribute("aria-label", title);
          popup.style.borderRadius = "20px";
        }

        const content = Swal.getHtmlContainer();
        if (content) {
          content.setAttribute("aria-live", "polite");
        }
      },
      willClose: () => {
        if (previouslyFocused && previouslyFocused.focus) {
          previouslyFocused.focus();
        }
      },
    };

    return Swal.fire(swalConfig);
  };

  const zoneRefs = {
    inicio: useRef(null),
    desarrollo: useRef(null),
    final: useRef(null),
  };

  
  useEffect(() => {
    let raf1 = null;
    let raf2 = null;

    const focusIntro = () => {
      introRef.current?.focus();
    };

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(focusIntro);
    });

    const timeoutId = setTimeout(focusIntro, 350);

    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleIntroKeyDown = (e) => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      firstFragmentRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!phaseAnnouncement) return;

    let raf1 = null;
    let raf2 = null;

    const focusAnnouncer = () => {
      phaseAnnouncerRef.current?.focus();
    };

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(focusAnnouncer);
    });

    const timeoutId = setTimeout(focusAnnouncer, 350);

    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      clearTimeout(timeoutId);
    };
  }, [phaseAnnouncement]);

  const handlePhaseAnnouncerKeyDown = (e) => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      firstFragmentRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!showStoryModal) return;

    document.body.style.overflow = "hidden";

    const focusId = setTimeout(() => {
      const heading = document.getElementById("story-modal-title");
      heading?.focus();
    }, 700);

    return () => {
      clearTimeout(focusId);
      document.body.style.overflow = "";
    };
  }, [showStoryModal]);

  const handleDragStart = (e, fragment) => {
    setDraggedItem(fragment);
    e.dataTransfer.setData("text/plain", JSON.stringify(fragment));
    e.dataTransfer.effectAllowed = "copy";
    e.target.style.opacity = "0.5";

    announce(`Arrastrando: ${fragment.text}`);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const placeFragment = async (fragment, zoneType) => {
    if (zoneType !== currentPhase) {
      await showAccessibleAlert({
        icon: "warning",
        title: "¡Espera!",
        text: `Primero completa la parte de "${PHASE_LABEL[currentPhase]}"`,
      });
      return;
    }

    if (fragment.type !== zoneType) {
      await showAccessibleAlert({
        icon: "error",
        title: "¡Fragmento incorrecto!",
        text: `Este fragmento pertenece a "${PHASE_LABEL[fragment.type]}"`,
      });
      return;
    }

    if (selections[zoneType] !== null) {
      await showAccessibleAlert({
        icon: "info",
        title: "Ya elegiste tu opción",
        text: `Ya seleccionaste un fragmento para ${PHASE_LABEL[zoneType]}`,
      });
      return;
    }

    setSelections((prev) => ({
      ...prev,
      [zoneType]: fragment,
    }));

    if (currentPhase === "inicio" || currentPhase === "desarrollo") {
      await showAccessibleAlert({
        icon: "success",
        title: "Fragmento colocado correctamente",
        text: `Tu fragmento quedó colocado en el ${PHASE_LABEL[currentPhase]}.`,
      });

      const completedPhase = currentPhase;
      const nextPhase = completedPhase === "inicio" ? "desarrollo" : "final";
      const purpose =
        nextPhase === "desarrollo"
          ? "construir esta parte de la historia"
          : "terminar tu historia";

      setPhaseAnnouncement(
        `${PHASE_LABEL[completedPhase]} completado. Ahora estás en ` +
          `${PHASE_LABEL[nextPhase]}. Hay tres fragmentos disponibles para ` +
          `${purpose}. Utiliza Tab para recorrer las opciones.`,
      );
      setCurrentPhase(nextPhase);
    } else if (currentPhase === "final") {
      setShowStoryModal(true);
    }
  };

  const handleDrop = async (e, zoneType) => {
    e.preventDefault();

    let fragment;
    try {
      fragment = JSON.parse(e.dataTransfer.getData("text/plain"));
    } catch (error) {
      fragment = draggedItem;
    }

    if (!fragment) return;

    await placeFragment(fragment, zoneType);
  };

  const handleKeyDown = (e, fragment, zoneType) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      placeFragment(fragment, zoneType);
    }
  };

  const handleKeyboardDrop = (e, zoneType) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      announce(
        `Zona de ${PHASE_LABEL[zoneType]} activa. Utiliza Tab para ir a la ` +
          `lista de fragmentos disponibles y presiona Enter o Espacio sobre ` +
          `uno para colocarlo aquí.`,
      );
    }
  };

  const getAvailableFragments = () => {
    const allFragments = STORY_FRAGMENTS[currentPhase];
    const selectedFragment = selections[currentPhase];
    return allFragments.filter(
      (f) => !selectedFragment || f.id !== selectedFragment.id,
    );
  };

  const handleCloseStoryModal = () => {
    setShowStoryModal(false);
    setGameFinished(true);
    setShowConfetti(true);

    announce("¡Felicidades! Has completado la historia. ¡Eres un gran escritor!");

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
        <div
          role="status"
          aria-live="polite"
          id="status-announcer"
          className="sr-only"
        ></div>
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
        <div
          ref={introRef}
          id="game-intro"
          className="sr-only"
          tabIndex={-1}
          onKeyDown={handleIntroKeyDown}
        >
          {GAME_INTRO_TEXT}
        </div>

        <div className="literatura-header">
          <h1 className="literatura-title">{GAME_TITLE}</h1>
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
            <small>
              Arrastra UN fragmento a cada zona (también puedes usar Enter o
              Espacio)
            </small>
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
            Desarrollo{" "}
            {selections.desarrollo && <span aria-label="Completado">✓</span>}
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
            aria-label={`Zona de Inicio ${currentPhase === "inicio" ? "activa" : selections.inicio ? "completada" : "bloqueada"}`}
            onKeyDown={(e) =>
              currentPhase === "inicio" && handleKeyboardDrop(e, "inicio")
            }
            aria-disabled={currentPhase !== "inicio"}
          >
            <h3 id="inicio-title">INICIO</h3>
            <div className="zone-content" aria-labelledby="inicio-title">
              {selections.inicio ? (
                <div
                  className="placed-fragment"
                  aria-label={`Fragmento colocado en Inicio: ${selections.inicio.text}`}
                >
                  {selections.inicio.text}
                </div>
              ) : (
                <div
                  className="empty-zone"
                  aria-label={
                    currentPhase === "inicio"
                      ? "Zona vacía. Selecciona un fragmento de la lista para colocarlo aquí."
                      : "Esperando turno"
                  }
                >
                  {currentPhase === "inicio"
                    ? "Arrastra aquí tu fragmento"
                    : "Esperando..."}
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
            aria-label={`Zona de Desarrollo ${currentPhase === "desarrollo" ? "activa" : selections.desarrollo ? "completada" : "bloqueada"}`}
            onKeyDown={(e) =>
              currentPhase === "desarrollo" &&
              handleKeyboardDrop(e, "desarrollo")
            }
            aria-disabled={currentPhase !== "desarrollo"}
          >
            <h3 id="desarrollo-title">DESARROLLO</h3>
            <div className="zone-content" aria-labelledby="desarrollo-title">
              {selections.desarrollo ? (
                <div
                  className="placed-fragment"
                  aria-label={`Fragmento colocado en Desarrollo: ${selections.desarrollo.text}`}
                >
                  {selections.desarrollo.text}
                </div>
              ) : (
                <div
                  className="empty-zone"
                  aria-label={
                    currentPhase === "desarrollo"
                      ? "Zona vacía. Selecciona un fragmento de la lista para colocarlo aquí."
                      : selections.inicio
                        ? "Esperando turno"
                        : "Necesitas completar el inicio primero"
                  }
                >
                  {currentPhase === "desarrollo"
                    ? "Arrastra aquí tu fragmento"
                    : selections.inicio
                      ? "Esperando..."
                      : "Bloqueado"}
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
            aria-label={`Zona de Final ${currentPhase === "final" ? "activa" : selections.final ? "completada" : "bloqueada"}`}
            onKeyDown={(e) =>
              currentPhase === "final" && handleKeyboardDrop(e, "final")
            }
            aria-disabled={currentPhase !== "final"}
          >
            <h3 id="final-title">FINAL</h3>
            <div className="zone-content" aria-labelledby="final-title">
              {selections.final ? (
                <div
                  className="placed-fragment"
                  aria-label={`Fragmento colocado en Final: ${selections.final.text}`}
                >
                  {selections.final.text}
                </div>
              ) : (
                <div
                  className="empty-zone"
                  aria-label={
                    currentPhase === "final"
                      ? "Zona vacía. Selecciona un fragmento de la lista para colocarlo aquí."
                      : selections.desarrollo
                        ? "Esperando turno"
                        : "Necesitas completar el desarrollo primero"
                  }
                >
                  {currentPhase === "final"
                    ? "Arrastra aquí tu fragmento"
                    : selections.desarrollo
                      ? "Esperando..."
                      : "Bloqueado"}
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          ref={phaseAnnouncerRef}
          id="phase-transition-announcer"
          className="sr-only"
          tabIndex={-1}
          onKeyDown={handlePhaseAnnouncerKeyDown}
        >
          {phaseAnnouncement}
        </div>

        <div
          className="available-fragments"
          role="region"
          aria-label={`Fragmentos disponibles para ${PHASE_LABEL[currentPhase]}`}
        >
          <h3 id="fragments-title">
            Fragmentos disponibles - {currentPhase.toUpperCase()}
          </h3>
          <div
            className="fragments-grid"
            role="listbox"
            aria-label="Lista de fragmentos para seleccionar"
            aria-labelledby="fragments-title"
          >
            {getAvailableFragments().map((fragment, index) => {
              const fragmentLabel = `Fragmento de ${PHASE_LABEL[currentPhase]} ${index + 1} de 3: ${fragment.text}. Presiona Enter o Espacio para seleccionarlo y colocarlo en el área de ${PHASE_LABEL[currentPhase]}.`;

              return (
                <div
                  key={fragment.id}
                  className="fragment-card"
                  ref={index === 0 ? firstFragmentRef : null}
                  draggable
                  onDragStart={(e) => handleDragStart(e, fragment)}
                  onDragEnd={handleDragEnd}
                  tabIndex={0}
                  role="option"
                  aria-label={fragmentLabel}
                  onKeyDown={(e) => handleKeyDown(e, fragment, currentPhase)}
                  aria-selected={focusedFragment === fragment.id}
                >
                  <span className="drag-icon" aria-hidden="true">
                    ⋮⋮
                  </span>
                  {fragment.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showStoryModal &&
        selections.inicio &&
        selections.desarrollo &&
        selections.final && (
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
                  Fragmento colocado correctamente en el Final. Historia
                  completada. Has construido tu propia historia. El inicio
                  dice: {selections.inicio.text}. El desarrollo dice:{" "}
                  {selections.desarrollo.text}. El final dice:{" "}
                  {selections.final.text}. Utiliza Tab para ir al botón
                  Terminar y presiona Enter para continuar.
                </div>

                <div className="story-modal-npc">
                  <img
                    src="/assets/ui/Psicologia/person4.png"
                    alt="Personaje feliz celebrando tu historia"
                    aria-label="Personaje celebrando tu historia"
                  />
                  <div className="story-modal-bubble">
                    <p className="reaction-text">
                      ¡Wow! ¡Qué historia tan fascinante!
                    </p>
                    <p className="reaction-subtext">
                      Me encantó cómo la construiste
                    </p>
                  </div>
                </div>

                <div className="story-modal-book">
                  <h2 id="story-modal-title" tabIndex={-1}>
                    La historia que creaste
                  </h2>

                  <div
                    className="complete-story"
                    role="article"
                    aria-label="Historia completa creada por ti"
                  >
                    <div className="story-part inicio-part">
                      <span className="story-label" id="story-inicio-label">
                        INICIO
                      </span>
                      <p aria-labelledby="story-inicio-label">
                        {selections.inicio.text}
                      </p>
                    </div>
                    <div className="story-part desarrollo-part">
                      <span className="story-label" id="story-desarrollo-label">
                        DESARROLLO
                      </span>
                      <p aria-labelledby="story-desarrollo-label">
                        {selections.desarrollo.text}
                      </p>
                    </div>
                    <div className="story-part final-part">
                      <span className="story-label" id="story-final-label">
                        FINAL
                      </span>
                      <p aria-labelledby="story-final-label">
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