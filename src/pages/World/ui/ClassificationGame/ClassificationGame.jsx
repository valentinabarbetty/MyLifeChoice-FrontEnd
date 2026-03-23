import { useState } from "react";
import Swal from "sweetalert2";
import "./ClassificationGame.css";
import ConfettiEffect from "../Confetti";
import GameCompleteModal from "../GameCompleteModal/GameCompleteModal";

export default function ClassificationGame({
  title,
  subtitle,
  itemsData,
  categories,
  renderItem,
  onComplete,
  errorMessage = "Revisa bien e intenta de nuevo 😅",
}) {
  const [items, setItems] = useState(itemsData);
  const [zones, setZones] = useState(
    Object.fromEntries(categories.map((c) => [c.id, []])),
  );

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("item", JSON.stringify(item));
  };
  const [gameFinished, setGameFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const handleDrop = (e, zone) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("item"));

    let newZones = {};
    let movedFromItems = false;

    Object.keys(zones).forEach((z) => {
      if (zones[z].some((i) => i.id === item.id)) {
        newZones[z] = zones[z].filter((i) => i.id !== item.id);
      } else {
        newZones[z] = zones[z];
      }
    });

    if (items.some((i) => i.id === item.id)) {
      movedFromItems = true;
    }

    newZones[zone] = [...newZones[zone], item];

    setZones(newZones);

    if (movedFromItems) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    }
  };

  const handleValidate = () => {
    if (items.length > 0) {
      Swal.fire({
        title: "Te faltan ejercicios 👀",
        text: "Debes clasificar todos antes de continuar",
        icon: "info",
        confirmButtonColor: "#22c55e",
      });
      return;
    }


    let correct = true;

    Object.keys(zones).forEach((zone) => {
      zones[zone].forEach((item) => {
        if (item.correct !== zone) {
          correct = false;
        }
      });
    });

    if (!correct) {
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
          message="Clasificaste correctamente los ejercicios."
          onContinue={onComplete}
        />
      </>
    );
  }

  return (
    <div className="overlay">
      <div className="panel generic">
        <h2>{title}</h2>
        <p>{subtitle}</p>

        <div className="game-layout">
          <div className="items">
            {items.map((item) => {
              const hasImage = item.image;

              return (
                <div
                  key={item.id}
                  className={`card ${hasImage ? "with-image" : "text-only"}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  {renderItem(item)}
                </div>
              );
            })}
          </div>

          <div className="categories">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="drop-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, cat.id)}
              >
                <h3>
                  {cat.emoji} {cat.label}
                </h3>

                <div className="drop-content">
                  {zones[cat.id].map((item) => {
                    const hasImage = item.image;

                    return (
                      <div
                        key={item.id}
                        className={`card small ${
                          hasImage ? "with-image" : "text-only"
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                      >
                        {renderItem(item)}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn" onClick={handleValidate}>
          Continuar
        </button>
      </div>
    </div>
  );
}
