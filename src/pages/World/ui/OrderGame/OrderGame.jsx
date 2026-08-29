import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "./OrderGame.css";

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
import ConfettiEffect from "../Confetti";
import GameCompleteModal from "../GameCompleteModal/GameCompleteModal";

const getItemLabel = (item) =>
  item.label || item.text || item.name || item.title || "Elemento";

const stripEmojis = (str = "") =>
  str.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim();

// Instrucciones que dnd-kit asocia automáticamente a cada tarjeta mediante
// aria-describedby (genera su propio elemento oculto internamente). Por
// defecto ese texto viene en inglés; esta es la causa real del "inglés"
// reportado, no un texto suelto en algún otro lugar del componente. Se
// sobrescribe aquí, una sola vez para todo el contexto de arrastre.
const dndScreenReaderInstructions = {
  draggable:
    "Presiona Enter o la barra espaciadora para seleccionar esta tarjeta. " +
    "Mientras está seleccionada, usa las flechas izquierda y derecha para " +
    "cambiar su posición entre las cuatro disponibles. Presiona Enter o " +
    "espacio nuevamente para confirmar la nueva posición, o Escape para " +
    "cancelar el movimiento.",
};

function SortableItem({ item, renderItem, index, totalItems }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="order-game-card"
      data-order={index + 1}
      tabIndex={0}
      role="button"
      aria-label={`Tarjeta: ${getItemLabel(item)}, posición ${index + 1} de ${totalItems}.`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (attributes.onKeyDown) {
            attributes.onKeyDown(e);
          }
        }
      }}
      {...attributes}
      {...listeners}
    >
      {renderItem(item)}
    </div>
  );
}

export default function OrderGame({
  title,
  subtitle,
  itemsData,
  correctOrder,
  renderItem,
  onComplete,
  errorMessage = "Revisa el orden e intenta de nuevo 😅",
}) {
  const [order, setOrder] = useState(itemsData);
  const [gameFinished, setGameFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const showAccessibleAlert = async ({
    icon,
    title,
    text,
    showConfirmButton = true,
  }) => {
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
      showConfirmButton,
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

        if (announcerRef.current) {
          announcerRef.current.textContent = `${title}. ${text}. Presiona Enter o Espacio para cerrar.`;
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
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const announcerRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Bandera para detectar que onDragOver se disparó justo después de
  // onDragStart (dnd-kit ejecuta una primera detección de colisión apenas
  // se selecciona la tarjeta, incluso sin que el usuario haya movido nada
  // todavía). Como ambos anuncios comparten la MISMA región viva de
  // dnd-kit, si ocurren así de seguido el segundo sobrescribe al primero
  // antes de que el lector de pantalla llegue a leerlo — por eso solo se
  // escuchaba la posición. La solución es fusionarlos en un único mensaje
  // atómico cuando esto pasa, en vez de depender de que se lean como dos
  // anuncios separados.
  const justSelectedRef = useRef(false);

  // Anuncios propios de dnd-kit para el ciclo de arrastre por teclado
  // (selección, cambio de posición, confirmación, cancelación). Estos usan
  // la región viva que dnd-kit administra internamente para su sistema de
  // accesibilidad — separada de `announcerRef`, que este componente usa
  // para otros mensajes (título/subtítulo al montar, resultado de
  // "Validar"). Mantenerlas separadas evita que ambas regiones compitan
  // por anunciar lo mismo al mismo tiempo.
  const dndAccessibility = {
    screenReaderInstructions: dndScreenReaderInstructions,
    announcements: {
      onDragStart() {
        justSelectedRef.current = true;
        return "Tarjeta seleccionada.";
      },
      onDragOver({ over }) {
        if (!over) return "";
        const position = order.findIndex((i) => i.id === over.id) + 1;
        if (position <= 0) return "";
        const justSelected = justSelectedRef.current;
        justSelectedRef.current = false;
        return justSelected
          ? `Tarjeta seleccionada. Tarjeta en posición ${position} de ${order.length}.`
          : `Tarjeta en posición ${position} de ${order.length}.`;
      },
      onDragEnd({ active, over }) {
        justSelectedRef.current = false;
        const item = order.find((i) => i.id === active.id);
        const label = item ? getItemLabel(item) : "";
        if (!over) {
          return `Tarjeta ${label} devuelta a su posición original.`.trim();
        }
        const position = order.findIndex((i) => i.id === over.id) + 1;
        return `Tarjeta ${label} posicionada satisfactoriamente en la posición ${position} de ${order.length}.`.trim();
      },
      onDragCancel({ active }) {
        justSelectedRef.current = false;
        const item = order.find((i) => i.id === active.id);
        const label = item ? getItemLabel(item) : "";
        const position = order.findIndex((i) => i.id === active.id) + 1;
        return `Movimiento cancelado. Tarjeta ${label} permanece en la posición ${position} de ${order.length}.`.trim();
      },
    },
  };


  useEffect(() => {
    const focusId = setTimeout(() => {
      titleRef.current?.focus();
    }, 100);

    const announceId = setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = "";
        requestAnimationFrame(() => {
          if (announcerRef.current) {
            announcerRef.current.textContent = `${stripEmojis(title)}. ${stripEmojis(subtitle)}`;
          }
        });
      }
    }, 300);

    return () => {
      clearTimeout(focusId);
      clearTimeout(announceId);
    };
  }, [title, subtitle]);

  useEffect(() => {
    if (!announcerRef.current || !announcement) return;
    announcerRef.current.textContent = "";
    requestAnimationFrame(() => {
      if (announcerRef.current) announcerRef.current.textContent = announcement;
    });
  }, [announcement]);

  const handleValidate = async () => {
    const isCorrect = order.every((item, i) => item.id === correctOrder[i]);

    if (!isCorrect) {
      setAnnouncement("El orden es incorrecto. Revisa e intenta de nuevo.");
      await showAccessibleAlert({
        icon: "warning",
        title: "Casi lo logras",
        text: errorMessage,
        showConfirmButton: true,
      });
      return;
    }

    setAnnouncement("¡Correcto! El orden es el adecuado. ¡Felicidades!");
    setGameFinished(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = order.findIndex((i) => i.id === active.id);
      const newIndex = order.findIndex((i) => i.id === over.id);
      const newOrder = arrayMove(order, oldIndex, newIndex);
      setOrder(newOrder);
      // No se anuncia nada aquí: dndAccessibility.announcements.onDragEnd
      // (arriba) ya produce el anuncio de confirmación de posición en
      // español a través de la región viva propia de dnd-kit. Anunciar
      // también desde acá duplicaría el mensaje (ver punto 10 del pedido).
    }
  };

  if (gameFinished) {
    return (
      <>
        {showConfetti && <ConfettiEffect />}
        <GameCompleteModal
          title="¡Excelente!"
          message="Ordenaste correctamente el proceso."
          onContinue={() => onComplete?.()}
        />
      </>
    );
  }

  return (
    <div className="order-game-overlay">
      <div
        className="order-game-panel"
        role="region"
        aria-labelledby="game-title"
        aria-describedby="game-subtitle game-instructions"
      >
        <h2
          id="game-title"
          ref={titleRef}
          tabIndex={-1}
          className="order-game-title"
        >
          {title}
        </h2>

        <p id="game-subtitle" className="order-game-subtitle">
          {subtitle}
        </p>

        <div
          ref={announcerRef}
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        />

        <div id="game-instructions" className="sr-only">
          Arrastra y ordena los elementos. Usa Tab para navegar entre elementos.
          Presiona Enter para seleccionar un elemento, luego usa las flechas
          izquierda y derecha para moverlo de posición, y presiona Enter
          nuevamente para soltarlo.
        </div>

        <div className="order-game-container" ref={containerRef}>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            accessibility={dndAccessibility}
          >
            <SortableContext
              items={order.map((i) => i.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div
                className="order-game-cards"
                role="list"
                aria-label="Elementos para ordenar"
              >
                {order.map((item, idx) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    index={idx}
                    totalItems={order.length}
                    renderItem={renderItem}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <button
          className="order-game-btn"
          onClick={handleValidate}
          aria-label="Validar orden de los elementos"
          aria-describedby="validate-desc"
        >
          Continuar
        </button>

        <span id="validate-desc" className="sr-only">
          Presiona este botón para verificar si el orden de los elementos es
          correcto
        </span>
      </div>
    </div>
  );
}