import { useState, useEffect, useRef } from "react";
import "./IngenieriaIndustrialGame.css";
import GameCompleteModal from "../../../ui/GameCompleteModal/GameCompleteModal";
import ConfettiEffect from "../../../ui/Confetti";
import Swal from "sweetalert2";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import OptionCard from "../../../ui/OptionCard";

const INITIAL_ORDER = ["Empaque", "Pintura", "Ensamble", "Corte"];
const CORRECT_ORDER = ["Corte", "Ensamble", "Pintura", "Empaque"];

const TIMES = {
  Empaque: 10,
  Pintura: 5,
  Ensamble: 2,
  Corte: 8,
};

const IMAGES = {
  Empaque: "/assets/ui/IngenieriaIndustrial/box.png",
  Pintura: "/assets/ui/IngenieriaIndustrial/paint-roller.png",
  Ensamble: "/assets/ui/IngenieriaIndustrial/cogwheel.png",
  Corte: "/assets/ui/IngenieriaIndustrial/axe.png",
};

const PHASE_META = {
  1: {
    title: "Organiza la línea de producción",
    instructions:
      "Arrastra las tarjetas para ordenar las etapas del proceso. Usa Tab para moverte entre tarjetas, Enter para agarrar y soltar, y las flechas para reposicionar.",
  },
  2: {
    title: "¿Cuál es el cuello de botella?",
    instructions:
      "Selecciona la etapa que tarda más tiempo y representa el cuello de botella del proceso. Presiona Tab para moverte entre las opciones y Enter para seleccionar.",
  },
  3: {
    title: "¿Cómo optimizamos?",
    instructions:
      "Elige la mejor solución para optimizar la etapa con mayor tiempo de proceso.",
  },
};

const dragScreenReaderInstructions = {
  draggable:
    "Para reordenar una tarjeta, presiona Enter o la barra espaciadora para agarrarla. Mientras la arrastras, usa las flechas del teclado para cambiarla de posición. Presiona Enter o espacio nuevamente para soltarla, o Escape para cancelar.",
};

function getDragAnnouncements(order) {
  return {
    onDragStart({ active }) {
      return `${active.id} agarrado. Usa las flechas para moverlo y Enter o espacio para soltarlo.`;
    },
    onDragOver({ active, over }) {
      if (over) {
        const position = order.indexOf(over.id) + 1;
        return `${active.id} se movió a la posición número ${position}.`;
      }
      return `${active.id} ya no está sobre ninguna posición.`;
    },
    onDragCancel({ active }) {
      return `Movimiento cancelado. ${active.id} volvió a su posición anterior.`;
    },
  };
}

const SOLUTIONS = [
  { value: "personal", label: "Contratar más personal", emoji: "📋" },
  { value: "mejorar", label: "Comprar máquinas de empaque", emoji: "🏭" },
  { value: "nada", label: "Nada", emoji: "❌" },
];

function SortableItem({ id, index, totalItems }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card drag"
      {...attributes}
      {...listeners}
      role="button"
      tabIndex={0}
      aria-roledescription="tarjeta arrastrable"
      aria-label={`${id}, posición ${index + 1} de ${totalItems}. Presiona Enter para agarrar y usar flechas para mover.`}
      aria-describedby={`sort-desc-${id}`}
    >
      <h3 aria-hidden="true">{id}</h3>
      <img src={IMAGES[id]} className="card-img" alt="" aria-hidden="true" />
      <span id={`sort-desc-${id}`} className="sr-only">
        Puedes arrastrar esta etapa o usar Enter y las flechas para reordenar
      </span>
    </div>
  );
}

export default function IngenieriaIndustrialGame({ onComplete }) {
  const [phase, setPhase] = useState(1);
  const [order, setOrder] = useState(INITIAL_ORDER);
  const [selectedBottleneck, setSelectedBottleneck] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const panelRef = useRef(null);
  const announcerRef = useRef(null);
  const showAccessibleAlert = async ({
    icon,
    title,
    text,
    confirmButtonText = "Reintentar",
  }) => {
    const previouslyFocused = document.activeElement;

    const swalConfig = {
      title,
      text,
      icon,
      confirmButtonText,
      confirmButtonColor: "#f59e0b",
      background: "#fef7e7",
      backdrop: "rgba(0,0,0,0.4)",
      allowOutsideClick: false,
      allowEscapeKey: true,
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        if (confirmButton) {
          confirmButton.focus();
          confirmButton.setAttribute("aria-label", `Cerrar alerta: ${title}`);
        }

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
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const id = setTimeout(() => {
      panelRef.current?.focus();
    }, 100);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (announcerRef.current && announcement) {
      announcerRef.current.textContent = "";
      requestAnimationFrame(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = announcement;
        }
      });
    }
  }, [announcement]);

  const showError = async (
    msg = "Revisa bien las opciones y vuelve a intentar",
  ) => {
    setAnnouncement(`Respuesta incorrecta. ${msg}`);
    await showAccessibleAlert({
      icon: "warning",
      title: "Casi lo logras 😅",
      text: msg,
      confirmButtonText: "Reintentar",
    });
  };

  const validatePhase1 = async () => {
    const isCorrect = order.every((item, i) => item === CORRECT_ORDER[i]);
    if (isCorrect) {
      setSelectedBottleneck(null);
      setAnnouncement(
        "Orden de la línea de producción completada correctamente. Ahora identifica el cuello de botella.",
      );
      setPhase(2);
    } else {
      await showError();
    }
  };
  const validatePhase2 = async () => {
    if (selectedBottleneck === "Empaque") {
      setSelectedSolution(null);
      setAnnouncement(
        `${selectedBottleneck} confirmado como cuello de botella. Ahora elige la solución para optimizarlo.`,
      );
      setPhase(3);
    } else {
      await showError();
    }
  };

  const validatePhase3 = async () => {
    if (selectedSolution === "mejorar") {
      const solutionLabel = SOLUTIONS.find(
        (s) => s.value === selectedSolution,
      )?.label;
      setAnnouncement(
        `${solutionLabel} aplicado a ${selectedBottleneck}. Proceso optimizado correctamente.`,
      );
      setGameFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    } else {
      await showError(
        "La solución óptima es mejorar la etapa con mayor tiempo de proceso.",
      );
    }
  };

  if (gameFinished) {
    return (
      <div className="overlay">
        {showConfetti && <ConfettiEffect />}
        <GameCompleteModal
          title="¡Excelente!"
          message="Optimizaste correctamente el proceso productivo."
          onContinue={onComplete}
        />
      </div>
    );
  }

  const currentMeta = PHASE_META[phase];

  return (
    <div className="overlay">
      <div
        ref={announcerRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div
        className="panel"
        ref={panelRef}
        tabIndex={-1}
        role="region"
        aria-labelledby="game-title"
        aria-describedby="game-instructions"
      >
        <h2 id="game-title">{currentMeta.title}</h2>

        <div id="game-instructions" className="sr-only">
          {currentMeta.instructions}
        </div>
        {phase === 1 && (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              accessibility={{
                announcements: getDragAnnouncements(order),
                screenReaderInstructions: dragScreenReaderInstructions,
              }}
              onDragEnd={({ active, over }) => {
                if (!over || active.id === over.id) return;
                const oldIndex = order.indexOf(active.id);
                const newIndex = order.indexOf(over.id);
                const newOrder = arrayMove(order, oldIndex, newIndex);
                setOrder(newOrder);
                setAnnouncement(
                  `${active.id} se movió a la posición ${newIndex + 1} satisfactoriamente, presiona TAB para continuar organizando o para ir al botón de Continuar.`,
                );
              }}
            >
              <SortableContext
                items={order}
                strategy={horizontalListSortingStrategy}
              >
                <div
                  className="cards"
                  role="list"
                  aria-label="Etapas de producción para ordenar"
                >
                  {order.map((item, idx) => (
                    <SortableItem
                      key={item}
                      id={item}
                      index={idx}
                      totalItems={order.length}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <button
              className="ing-btn"
              onClick={validatePhase1}
              aria-label="Confirmar orden de la línea de producción"
            >
              Continuar
            </button>
          </>
        )}

        {phase === 2 && (
          <>
            <div role="group" aria-labelledby="bottleneck-group-label">
              <p id="bottleneck-group-label" className="sr-only">
                Selecciona la etapa que representa el cuello de botella,
                presiona Tab para moverte entre las opciones y Enter para
                seleccionar.
              </p>

              <div
                className="cards"
                role="list"
                aria-label="Etapas con tiempos de proceso"
              >
                {order.map((item) => (
                  <OptionCard
                    key={item}
                    title={item}
                    image={IMAGES[item]}
                    subtitle={`${TIMES[item]} segundos`}
                    isActive={selectedBottleneck === item}
                    onClick={() => {
                      setSelectedBottleneck(item);
                      setAnnouncement(
                        `${item} seleccionado, presiona Tab para ir al botón de continuar. ${TIMES[item]} segundos.`,
                      );
                    }}
                    aria-pressed={selectedBottleneck === item}
                    role="button"
                    aria-label={`${item}, ${TIMES[item]} segundos${selectedBottleneck === item ? ", seleccionado, presiona Tab para ir al botón de continuar" : ""}`}
                  />
                ))}
              </div>
            </div>

            <button
              className="ing-btn"
              onClick={validatePhase2}
              aria-label="Confirmar selección del cuello de botella"
              aria-disabled={!selectedBottleneck}
            >
              Continuar
            </button>
          </>
        )}

        {phase === 3 && (
          <>
            <div
              className="selected-station"
              role="region"
              aria-label={`Estación seleccionada: ${selectedBottleneck}, ${TIMES[selectedBottleneck]} segundos`}
            >
              <h3 aria-hidden="true">{selectedBottleneck}</h3>
              <img
                src={IMAGES[selectedBottleneck]}
                className="selected-img"
                alt=""
                aria-hidden="true"
              />
              <p aria-hidden="true">{TIMES[selectedBottleneck]} segundos</p>
            </div>

            <div
              className="options-container"
              role="radiogroup"
              aria-labelledby="solution-group-label"
            >
              <p id="solution-group-label" className="sr-only">
                Selecciona una solución para optimizar {selectedBottleneck}
              </p>

              {SOLUTIONS.map(({ value, label, emoji }) => (
                <button
                  key={value}
                  className={`option-button ${selectedSolution === value ? "selected" : ""}`}
                  role="radio"
                  aria-checked={selectedSolution === value}
                  onClick={() => {
                    setSelectedSolution(value);
                    setAnnouncement(`Seleccionaste: ${label}. Presiona Tab para ir al botón de Finalizar.`);
                  }}
                >
                  <span aria-hidden="true">{emoji}</span> {label}
                </button>
              ))}
            </div>

            <button
              className="ing-btn"
              onClick={validatePhase3}
              aria-label="Finalizar y confirmar solución seleccionada"
              aria-disabled={!selectedSolution}
            >
              Finalizar
            </button>
          </>
        )}
      </div>
    </div>
  );
}