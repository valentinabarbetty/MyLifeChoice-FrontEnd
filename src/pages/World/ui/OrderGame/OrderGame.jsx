import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "./OrderGame.css"

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
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
      aria-label={`${getItemLabel(item)}, posición ${index + 1} de ${totalItems}. Presiona Enter para seleccionar y usar flechas para mover.`}
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

  const titleRef     = useRef(null);
  const containerRef = useRef(null);
  const announcerRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const focusId = setTimeout(() => {
      titleRef.current?.focus();
    }, 100);

    const announceId = setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = "";
        requestAnimationFrame(() => {
          if (announcerRef.current) {
            announcerRef.current.textContent =
              `${stripEmojis(title)}. ${stripEmojis(subtitle)}`;
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

  const handleValidate = () => {
    const isCorrect = order.every((item, i) => item.id === correctOrder[i]);

    if (!isCorrect) {
      setAnnouncement("El orden es incorrecto. Revisa e intenta de nuevo.");
      Swal.fire({
        title: "Casi lo logras 😅",
        text: errorMessage,
        icon: "warning",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
        backdrop: `rgba(0,0,0,0.4)`,
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
      setAnnouncement(
        `${getItemLabel(order[oldIndex])} movido a la posición ${newIndex + 1}`
      );
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
          Arrastra y ordena los elementos. Usa Tab para navegar entre
          elementos. Presiona Enter para seleccionar un elemento, luego
          usa las flechas izquierda y derecha para moverlo de posición,
          y presiona Enter nuevamente para soltarlo.
        </div>

        <div className="order-game-container" ref={containerRef}>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
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
          Presiona este botón para verificar si el orden de los elementos
          es correcto
        </span>
      </div>
    </div>
  );
}