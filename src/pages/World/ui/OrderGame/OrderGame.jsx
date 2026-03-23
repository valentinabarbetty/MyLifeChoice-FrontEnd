import { useState } from "react";
import Swal from "sweetalert2";
import "./OrderGame.css"


import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ConfettiEffect from "../Confetti";
import GameCompleteModal from "../GameCompleteModal/GameCompleteModal";

function SortableItem({ item, renderItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card drag"
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

  const handleValidate = () => {
    const isCorrect = order.every(
      (item, i) => item.id === correctOrder[i]
    );

    if (!isCorrect) {
      Swal.fire({
        title: "Casi lo logras 😅",
        text: errorMessage,
        icon: "warning",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    setGameFinished(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  if (gameFinished) {
    return (
      <>
        {showConfetti && <ConfettiEffect />}
        <GameCompleteModal
          title="🎉 ¡Excelente!"
          message="Ordenaste correctamente el proceso."
          onContinue={() => onComplete?.()}
        />
      </>
    );
  }

  return (
    <div className="overlay">
      <div className="panel generic">
        <h2>{title}</h2>
        <p>{subtitle}</p>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (!over) return;

            if (active.id !== over.id) {
              const oldIndex = order.findIndex((i) => i.id === active.id);
              const newIndex = order.findIndex((i) => i.id === over.id);

              setOrder(arrayMove(order, oldIndex, newIndex));
            }
          }}
        >
          <SortableContext
            items={order.map((i) => i.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="cards">
              {order.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  renderItem={renderItem}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button className="btn" onClick={handleValidate}>
          Continuar
        </button>
      </div>
    </div>
  );
}