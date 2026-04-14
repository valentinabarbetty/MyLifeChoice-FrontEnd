import { useState } from "react";
import "./IngenieriaIndustrialGame.css";
import GameCompleteModal from "../../../ui/GameCompleteModal/GameCompleteModal";
import ConfettiEffect from "../../../ui/Confetti";
import Swal from "sweetalert2";

import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import OptionButtons from "../../../ui/OptionButtons";
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

function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

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
      <h3>{id}</h3>
      <img src={IMAGES[id]} className="card-img" alt={id} />
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

  const showError = () => {
    Swal.fire({
      title: "Casi lo logras 😅",
      text: "Revisa bien las opciones y vuelve a intentar",
      icon: "warning",
      confirmButtonText: "Reintentar",
      confirmButtonColor: "#22c55e",
      background: "#fef7e7",
      backdrop: `rgba(0,0,0,0.4)`,
    });
  };

  const validatePhase1 = () => {
    const isCorrect = order.every((item, i) => item === CORRECT_ORDER[i]);

    if (isCorrect) {
      setSelectedBottleneck(null);
      setPhase(2);
    } else {
      showError();
    }
  };

  const validatePhase2 = () => {
    if (selectedBottleneck === "Empaque") {
      setSelectedSolution(null);
      setPhase(3);
    } else {
      showError();
    }
  };

  const validatePhase3 = () => {
    if (selectedSolution === "mejorar") {
      setGameFinished(true);
      setShowConfetti(true);

      setTimeout(() => setShowConfetti(false), 4000);
    } else {
      showError();
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

  return (
    <div className="overlay">
      <div className="panel">
        {phase === 1 && (
          <>
            <h2>Organiza la línea de producción</h2>

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event;

                if (!over) return;

                if (active.id !== over.id) {
                  const oldIndex = order.indexOf(active.id);
                  const newIndex = order.indexOf(over.id);

                  setOrder(arrayMove(order, oldIndex, newIndex));
                }
              }}
            >
              <SortableContext
                items={order}
                strategy={horizontalListSortingStrategy}
              >
                <div className="cards">
                  {order.map((item) => (
                    <SortableItem key={item} id={item} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <button className="ing-btn" onClick={validatePhase1}>
              Continuar
            </button>
          </>
        )}

        {phase === 2 && (
          <>
            <h2>¿Cuál es el cuello de botella?</h2>

            <div className="cards">
              {order.map((item) => (
                <OptionCard
                  key={item}
                  title={item}
                  image={IMAGES[item]}
                  subtitle={`${TIMES[item]} segundos`}
                  isActive={selectedBottleneck === item}
                  onClick={() => setSelectedBottleneck(item)}
                />
              ))}
            </div>

            <button className="ing-btn" onClick={validatePhase2}>
              Continuar
            </button>
          </>
        )}

        {phase === 3 && (
  <>
    <h2>¿Cómo optimizamos?</h2>

    <div className="selected-station">
      <h3>{selectedBottleneck}</h3>
      <img
        src={IMAGES[selectedBottleneck]}
        className="selected-img"
        alt={selectedBottleneck}
      />
      <p>{TIMES[selectedBottleneck]} segundos</p>
    </div>

    <div className="options-container">
      <button
        className={`option-button ${selectedSolution === "personal" ? "selected" : ""}`}
        onClick={() => setSelectedSolution("personal")}
      >
        📋 Contratar más personal
      </button>
      
      <button
        className={`option-button ${selectedSolution === "mejorar" ? "selected" : ""}`}
        onClick={() => setSelectedSolution("mejorar")}
      >
        🏭 Comprar máquinas de empaque
      </button>
      
      <button
        className={`option-button ${selectedSolution === "nada" ? "selected" : ""}`}
        onClick={() => setSelectedSolution("nada")}
      >
        ❌ Nada
      </button>
    </div>

    <button className="ing-btn" onClick={validatePhase3}>
      Finalizar
    </button>
  </>
)}
      </div>
    </div>
  );
}