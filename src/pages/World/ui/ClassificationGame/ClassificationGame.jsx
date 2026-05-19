import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import "./ClassificationGame.css";
import ConfettiEffect from "../Confetti";
import GameCompleteModal from "../GameCompleteModal/GameCompleteModal";
const getItemLabel = (item) => item.text || item.name || "Elemento";

export default function ClassificationGame({
  title,
  subtitle,
  itemsData,
  categories,
  renderItem,
  onComplete,
  errorMessage = "Revisa bien e intenta de nuevo",
}) {
  const [items, setItems] = useState(itemsData);
  const [zones, setZones] = useState(
    Object.fromEntries(categories.map((c) => [c.id, []])),
  );
  const [gameFinished, setGameFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const titleRef = useRef(null);
  const itemsContainerRef = useRef(null);
  const categoriesRef = useRef({});
  const announcerRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => titleRef.current?.focus(), 100);
    return () => clearTimeout(id);
  }, []);
  const showAccessibleAlert = async ({
    icon,
    title,
    text,
    showConfirmButton = true,
    timer = null,
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
      ...(timer && { timer, timerProgressBar: true }),
      didOpen: () => {
        if (timer && !showConfirmButton) {
          const announcer = announcerRef.current;
          if (announcer) {
            announcer.textContent = `${title}. ${text}. Esta alerta se cerrará automáticamente en ${timer / 1000} segundos.`;
          }
        }

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
  useEffect(() => {
    if (!announcerRef.current || !announcement) return;
    announcerRef.current.textContent = "";
    requestAnimationFrame(() => {
      if (announcerRef.current) announcerRef.current.textContent = announcement;
    });
  }, [announcement]);
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over");
  };
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("item", JSON.stringify(item));
  };
  const handleDrop = (e, zone) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    moveItemToZone(JSON.parse(e.dataTransfer.getData("item")), zone);
  };

  const moveItemToZone = (item, zone) => {
    const newZones = {};
    let movedFromItems = false;

    Object.keys(zones).forEach((z) => {
      newZones[z] = zones[z].some((i) => i.id === item.id)
        ? zones[z].filter((i) => i.id !== item.id)
        : [...zones[z]];
    });

    if (items.some((i) => i.id === item.id)) movedFromItems = true;

    newZones[zone] = [...newZones[zone], item];
    setZones(newZones);
    if (movedFromItems)
      setItems((prev) => prev.filter((i) => i.id !== item.id));

    const category = categories.find((c) => c.id === zone);
    setAnnouncement(
      `${getItemLabel(item)} movido a ${category?.label || zone}`,
    );
    setSelectedItem(null);
    setTimeout(() => categoriesRef.current[zone]?.focus(), 100);
  };

  const moveItemBack = (item) => {
    const newZones = {};
    Object.keys(zones).forEach((z) => {
      newZones[z] = zones[z].filter((i) => i.id !== item.id);
    });
    setZones(newZones);
    setItems((prev) => [...prev, item]);
    setAnnouncement(
      `${getItemLabel(item)} devuelto a la bandeja de elementos.`,
    );
    setSelectedItem(null);
    setTimeout(() => itemsContainerRef.current?.focus(), 100);
  };
  const handleItemKeyDown = (e, item) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const isSelected = selectedItem?.id === item.id;
      setSelectedItem(isSelected ? null : item);
      setAnnouncement(
        isSelected
          ? `${getItemLabel(item)} deseleccionado.`
          : `${getItemLabel(item)} seleccionado. Navega a una categoría y presiona Enter para asignarlo.`,
      );
    }
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = items[items.findIndex((i) => i.id === item.id) + 1];
      if (next) document.getElementById(`item-${next.id}`)?.focus();
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = items[items.findIndex((i) => i.id === item.id) - 1];
      if (prev) document.getElementById(`item-${prev.id}`)?.focus();
    }
  };

  const handleCategoryKeyDown = (e, catId) => {
    if ((e.key === "Enter" || e.key === " ") && selectedItem) {
      e.preventDefault();
      moveItemToZone(selectedItem, catId);
    }
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = categories[categories.findIndex((c) => c.id === catId) + 1];
      if (next) categoriesRef.current[next.id]?.focus();
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = categories[categories.findIndex((c) => c.id === catId) - 1];
      if (prev) categoriesRef.current[prev.id]?.focus();
    }
  };

  const handlePlacedItemKeyDown = (e, item) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      moveItemBack(item);
    }
  };
  const handleValidate = async () => {
    if (items.length > 0) {
      setAnnouncement(`Faltan ${items.length} elementos por clasificar.`);
      await showAccessibleAlert({
        icon: "info",
        title: "Te faltan elementos",
        text: `Debes clasificar todos antes de continuar. Faltan ${items.length} elementos.`,
        showConfirmButton: true,
      });
      return;
    }

    const correct = Object.keys(zones).every((zone) =>
      zones[zone].every((item) => item.correct === zone),
    );

    if (!correct) {
      setAnnouncement("Clasificación incorrecta. " + errorMessage);
      await showAccessibleAlert({
        icon: "warning",
        title: "Casi lo logras",
        text: errorMessage,
        showConfirmButton: true,
      });
      return;
    }

    setAnnouncement(
      "¡Excelente! Clasificaste correctamente todos los elementos.",
    );
    setGameFinished(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  if (gameFinished) {
    return (
      <>
        {showConfetti && <ConfettiEffect />}
        <GameCompleteModal
          title="¡Excelente!"
          message="Clasificaste correctamente."
          onContinue={onComplete}
        />
      </>
    );
  }

  return (
    <div className="classification-game-overlay">
      <div
        ref={announcerRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div
        className="classification-game-panel"
        role="region"
        aria-labelledby="classification-title"
        aria-describedby="classification-subtitle classification-instructions"
      >
        <h2
          id="classification-title"
          ref={titleRef}
          tabIndex={-1}
          className="game-title"
          aria-live="polite"
        >
          {title}
        </h2>

        <p id="classification-subtitle" className="game-subtitle">
          {subtitle}
        </p>

        <div id="classification-instructions" className="sr-only">
          Arrastra cada elemento a su categoría o usa Tab para navegar, Enter
          para seleccionar un elemento y luego Enter en una categoría para
          asignarlo. Presiona Enter sobre un elemento ya clasificado para
          devolverlo a la bandeja.
        </div>

        <div className="classification-game-layout">
          <div
            ref={itemsContainerRef}
            className="classification-game-items"
            role="region"
            aria-label={`Elementos para clasificar. ${items.length} elementos disponibles.`}
            tabIndex={-1}
          >
            <h3 className="sr-only">Elementos disponibles</h3>

            {items.map((item) => (
              <div
                id={`item-${item.id}`}
                key={item.id}
                role="button"
                className={`classification-game-card ${item.image ? "with-image" : "text-only"} ${
                  selectedItem?.id === item.id ? "keyboard-selected" : ""
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                tabIndex={0}
                onKeyDown={(e) => handleItemKeyDown(e, item)}
                aria-label={
                  selectedItem?.id === item.id
                    ? `${getItemLabel(item)}, seleccionado. Navega a una categoría y presiona Enter para asignarlo.`
                    : `${getItemLabel(item)}. Presiona Enter para seleccionar.`
                }
                aria-pressed={selectedItem?.id === item.id}
              >
                <div aria-hidden="true">{renderItem(item)}</div>
              </div>
            ))}

            {items.length === 0 && (
              <div
                className="empty-items-message"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                tabIndex={0}
              >
                ¡Todos los elementos han sido clasificados!
              </div>
            )}
          </div>
          <div
            className="classification-game-categories"
            role="region"
            aria-label="Áreas de clasificación"
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                ref={(el) => (categoriesRef.current[cat.id] = el)}
                className={`classification-game-drop-zone ${selectedItem ? "keyboard-droppable" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, cat.id)}
                tabIndex={0}
                onKeyDown={(e) => handleCategoryKeyDown(e, cat.id)}
                role="button"
                aria-label={`Categoría ${cat.label}. ${zones[cat.id].length} elementos clasificados.${
                  selectedItem
                    ? ` Presiona Enter para asignar ${getItemLabel(selectedItem)} aquí.`
                    : ""
                }`}
              >
                <div aria-hidden="true">
                  <h3>
                    {cat.emoji} {cat.label}
                  </h3>
                </div>

                <div
                  className="classification-game-drop-content"
                  role="list"
                  aria-label={`Elementos en ${cat.label}`}
                >
                  {zones[cat.id].map((item) => (
                    <div
                      key={item.id}
                      role="listitem"
                      className={`classification-game-card small ${item.image ? "with-image" : "text-only"}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      tabIndex={0}
                      onKeyDown={(e) => handlePlacedItemKeyDown(e, item)}
                      aria-label={`${getItemLabel(item)} en ${cat.label}. Presiona Enter para devolver a la bandeja.`}
                    >
                      <div aria-hidden="true">{renderItem(item)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="classification-game-btn"
          onClick={handleValidate}
          aria-label={
            items.length > 0
              ? `Validar clasificación. Aún faltan ${items.length} elementos por clasificar.`
              : "Validar clasificación"
          }
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
