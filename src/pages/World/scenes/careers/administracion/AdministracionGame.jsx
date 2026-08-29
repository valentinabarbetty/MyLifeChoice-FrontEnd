import { useState, useEffect, useRef, useId } from "react";
import starImg from "/public/assets/ui/Administracion/star.png";
import dollarImg from "/public/assets/ui/Administracion/dollar.png";
import groupImg from "/public/assets/ui/Administracion/group.png";
import ConfettiEffect from "../../../ui/Confetti";
import "./AdministracionGame.css";
import GameCompleteModal from "../../../ui/GameCompleteModal/GameCompleteModal";
import Swal from "sweetalert2";

const MONEY_OPTIONS = [
  { value: "baja", label: "Bajo", cost: "10%", desc: "Inversión mínima" },
  { value: "media", label: "Medio", cost: "18%", desc: "Inversión estándar" },
  { value: "alta", label: "Alto", cost: "25%", desc: "Inversión máxima" },
];

const PEOPLE_OPTIONS = [
  { value: "baja", label: "Bajo", cost: "8%", desc: "Equipo mínimo" },
  { value: "media", label: "Medio", cost: "15%", desc: "Equipo estándar" },
  { value: "alta", label: "Alto", cost: "25%", desc: "Equipo completo" },
];

const SCREEN_READER_WORDS_PER_MINUTE = 150;
const READING_DELAY_SAFETY_BUFFER_MS = 700;
const MIN_READING_DELAY_MS = 1200;

function estimateReadingDelayMs(message) {
  const wordCount = message.trim().split(/\s+/).filter(Boolean).length;
  const readingMs = (wordCount / SCREEN_READER_WORDS_PER_MINUTE) * 60000;
  return Math.max(MIN_READING_DELAY_MS, Math.round(readingMs + READING_DELAY_SAFETY_BUFFER_MS));
}

export default function AdministracionGame({ onComplete }) {
  const scenarios = [
    {
      title: "RECLAMO DE CUENTA CLAVE",
      text: "Un cliente estratégico reporta un fallo grave en el servicio. Si no se soluciona rápido, podrías perder el contrato.",
      correct: { money: "media", people: "media" },
    },
    {
      title: "FALLA EN PRODUCCIÓN",
      text: "El sistema principal colapsó. La producción está detenida y las pérdidas aumentan por minuto.",
      correct: { money: "alta", people: "alta" },
    },
    {
      title: "EQUIPO DESMOTIVADO",
      text: "El equipo muestra baja productividad y varios empleados amenazan con renunciar.",
      correct: { money: "media", people: "baja" },
    },
    {
      title: "EXPANSIÓN INTERNACIONAL",
      text: "Oportunidad de negocio en el extranjero. Riesgo moderado, pero alto potencial de crecimiento.",
      correct: { money: "alta", people: "media" },
    },
  ];

  const [gameFinished, setGameFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [reputation, setReputation] = useState(0);
  const [budgetLeft, setBudgetLeft] = useState(100);
  const [staffLeft, setStaffLeft] = useState(100);
  const [assignments, setAssignments] = useState([
    { money: null, people: null, moneyScore: 0, peopleScore: 0 },
    { money: null, people: null, moneyScore: 0, peopleScore: 0 },
    { money: null, people: null, moneyScore: 0, peopleScore: 0 },
    { money: null, people: null, moneyScore: 0, peopleScore: 0 },
  ]);
  const [step, setStep] = useState(0);

  const announcerRef = useRef();

  const overlayRef = useRef(null);
  const situationInfoRef = useRef(null);
  const continueBtnRef = useRef(null);
  const previousFocusRef = useRef(null);
  const hiddenSiblingsRef = useRef([]);
  const resultsAnnouncedRef = useRef(false);
  const pendingSituationFocusDelayRef = useRef(80);

  const resourcesId = useId();
  const progressId = useId();
  const situationTextId = useId();
  const instructionId = useId();
  const tabHintId = useId();

  const announce = (message) => {
    if (!announcerRef.current) return;
    announcerRef.current.textContent = "";
    setTimeout(() => {
      if (announcerRef.current) announcerRef.current.textContent = message;
    }, 50);
  };

  useEffect(() => {
    previousFocusRef.current = document.activeElement;

    const overlay = overlayRef.current;
    if (overlay && overlay.parentElement) {
      const siblings = Array.from(overlay.parentElement.children).filter(
        (el) => el !== overlay
      );
      siblings.forEach((el) => {
        if (!el.hasAttribute("aria-hidden")) {
          el.setAttribute("aria-hidden", "true");
          hiddenSiblingsRef.current.push(el);
        }
      });
    }

    return () => {
      hiddenSiblingsRef.current.forEach((el) => el.removeAttribute("aria-hidden"));
      hiddenSiblingsRef.current = [];
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  const handleOverlayKeyDown = (e) => {
    if (e.key !== "Tab") return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const focusable = Array.from(
      overlay.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.disabled && el.offsetParent !== null);

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  useEffect(() => {
    const delay = resultsAnnouncedRef.current ? pendingSituationFocusDelayRef.current : 80;
    const focusTimer = setTimeout(() => {
      situationInfoRef.current?.focus();
      resultsAnnouncedRef.current = false;
    }, delay);

    return () => clearTimeout(focusTimer);
  }, [step]);

  const current = scenarios[step];
  const currentAssignment = assignments[step];

  const getMoneyCost = (level) => {
    switch (level) {
      case "baja":
        return 10;
      case "media":
        return 18;
      case "alta":
        return 25;
      default:
        return 0;
    }
  };

  const getPeopleCost = (level) => {
    switch (level) {
      case "baja":
        return 8;
      case "media":
        return 15;
      case "alta":
        return 25;
      default:
        return 0;
    }
  };

  const showAccessibleAlert = async ({
    icon,
    title,
    text,
    confirmButtonColor = "#f59e0b",
  }) => {
    const previouslyFocused = document.activeElement;

    const swalConfig = {
      title,
      text,
      icon,
      confirmButtonText: "Aceptar",
      confirmButtonColor,
      background: "#fef7e7",
      backdrop: true,
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

  const getMoneyScore = (selected, correct) => {
    if (!selected) return 0;
    if (selected === correct) return 15;
    if (
      (selected === "media" && correct === "baja") ||
      (selected === "media" && correct === "alta") ||
      (selected === "baja" && correct === "media") ||
      (selected === "alta" && correct === "media")
    )
      return 8;
    return 3;
  };

  const getPeopleScore = (selected, correct) => {
    if (!selected) return 0;
    if (selected === correct) return 10;
    if (
      (selected === "media" && correct === "baja") ||
      (selected === "media" && correct === "alta") ||
      (selected === "baja" && correct === "media") ||
      (selected === "alta" && correct === "media")
    )
      return 5;
    return 2;
  };

  const handleMoneyChange = async (level) => {
    const oldCost = currentAssignment.money
      ? getMoneyCost(currentAssignment.money)
      : 0;
    const newCost = getMoneyCost(level);
    const newBudgetLeft = budgetLeft + oldCost - newCost;

    if (newBudgetLeft < 0) {
      await showAccessibleAlert({
        icon: "warning",
        title: "Presupuesto insuficiente",
        text: `No tienes suficiente presupuesto. Te queda ${budgetLeft}% y necesitas ${newCost}%`,
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const newAssignments = [...assignments];
    newAssignments[step] = {
      ...currentAssignment,
      money: level,
      moneyScore: getMoneyScore(level, current.correct.money),
    };
    setAssignments(newAssignments);
    setBudgetLeft(newBudgetLeft);
  };

  const handlePeopleChange = async (level) => {
    const oldCost = currentAssignment.people
      ? getPeopleCost(currentAssignment.people)
      : 0;
    const newCost = getPeopleCost(level);
    const newStaffLeft = staffLeft + oldCost - newCost;

    if (newStaffLeft < 0) {
      await showAccessibleAlert({
        icon: "warning",
        title: "Personal insuficiente",
        text: `No tienes suficiente personal. Te queda ${staffLeft}% y necesitas ${newCost}%`,
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    const newAssignments = [...assignments];
    newAssignments[step] = {
      ...currentAssignment,
      people: level,
      peopleScore: getPeopleScore(level, current.correct.people),
    };
    setAssignments(newAssignments);
    setStaffLeft(newStaffLeft);
  };

  const handleContinue = async () => {
    if (!currentAssignment.money || !currentAssignment.people) {
      await showAccessibleAlert({
        icon: "warning",
        title: "Selecciona ambas opciones",
        text: "Debes asignar tanto presupuesto como personal para esta situación",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const reputationGained = currentAssignment.moneyScore + currentAssignment.peopleScore;
    const newReputation = Math.min(100, reputation + reputationGained);

    const isLastSituation = step === scenarios.length - 1;

    continueBtnRef.current?.blur();

    const resultsMessage = isLastSituation
      ? `Situación ${scenarios.length} de ${scenarios.length} completada. Reputación obtenida: ${reputationGained}%. El juego ha terminado.`
      : `Situación completada.`;
    announce(resultsMessage);

    setReputation(newReputation);

    if (isLastSituation) {
      setGameFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      return;
    }

    resultsAnnouncedRef.current = true;
    pendingSituationFocusDelayRef.current = estimateReadingDelayMs(resultsMessage);
    setStep((s) => s + 1);
  };

  const LiveAnnouncer = (
    <div
      ref={announcerRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
      }}
    />
  );

  if (gameFinished) {
    return (
      <>
        {LiveAnnouncer}
        {showConfetti && <ConfettiEffect />}
        <GameCompleteModal
          title="¡Felicidades!"
          message="Has completado el desafío de administración."
          extra={
            <p>
              Reputación final: <strong>{reputation}%</strong>
            </p>
          }
          onContinue={() => onComplete?.()}
        />
      </>
    );
  }

  return (
    <div
      className="adminGameOverlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Juego de administración de empresa"
      onKeyDown={handleOverlayKeyDown}
    >
      {LiveAnnouncer}
      <div className="adminGamePanel">
        <div
          className="adminGameTopBar"
          role="region"
          aria-label="Recursos disponibles"
        >
          <AdminStat
            img={starImg}
            label="Reputación"
            value={`${reputation}%`}
            percent={reputation}
          />
          <AdminStat
            img={dollarImg}
            label="Presupuesto"
            value={`${budgetLeft}%`}
            percent={budgetLeft}
          />
          <AdminStat
            img={groupImg}
            label="Personal"
            value={`${staffLeft}%`}
            percent={staffLeft}
          />
        </div>

        <div
          className="adminGameProgress"
          ref={situationInfoRef}
          id={progressId}
          role="group"
          tabIndex={-1}
          aria-labelledby={`${resourcesId} ${progressId} ${situationTextId} ${instructionId} ${tabHintId}`}
        >
          Situación {step + 1} de {scenarios.length}
        </div>

        <span
          id={resourcesId}
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
          }}
        >
          {`Tus recursos actuales: reputación ${reputation}%, presupuesto disponible ${budgetLeft}%, personal disponible ${staffLeft}%.`}
        </span>

        <p className="adminGameInstruction" id={instructionId}>
          Ayúdame a asignar presupuesto y personal para solucionar la siguiente
          situación
        </p>

        <span
          id={tabHintId}
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
          }}
        >
          Utilice Tab para avanzar hasta las opciones.
        </span>

        <div className="adminGameNpcContainer">
          <img
            src="/assets/ui/Software/personajes/person.png"
            className="adminGameNpcImg"
            alt=""
            aria-hidden="true"
          />
          <div className="adminGameBubble">
            <p className="adminGameBubbleText" id={situationTextId}>
              {current.text}
            </p>
          </div>
        </div>

        <div className="adminGameControls">
          <ResourceSelector
            title="Presupuesto a asignar"
            resourcePrefix="Presupuesto"
            resourceType="money"
            value={currentAssignment.money}
            options={MONEY_OPTIONS}
            onChange={handleMoneyChange}
            isLastSituation={step === scenarios.length - 1}
          />
          <ResourceSelector
            title="Personal a asignar"
            resourcePrefix="Personal"
            resourceType="people"
            value={currentAssignment.people}
            options={PEOPLE_OPTIONS}
            onChange={handlePeopleChange}
            isLastSituation={step === scenarios.length - 1}
          />
        </div>

        <button
          className="adminGameBtn"
          ref={continueBtnRef}
          onClick={handleContinue}
          aria-label={
            step === scenarios.length - 1
              ? "Finalizar. Presione Enter para finalizar el juego."
              : "Continuar. Presione Enter para continuar con la siguiente situación."
          }
        >
          {step === scenarios.length - 1 ? "Finalizar" : "Continuar"}
        </button>
      </div>
    </div>
  );
}

function AdminStat({ img, label, value, percent }) {
  return (
    <div className="adminGameStat">
      <img src={img} className="adminGameIconImg" alt="" aria-hidden="true" />
      <div className="adminGameStatContent">
        <div className="adminGameLabel" aria-hidden="true">
          {label}
        </div>
        <div className="adminGameValueSmall" aria-hidden="true">
          {value}
        </div>
        <div
          className="adminGameProgressBar"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label} ${percent}%`}
        >
          <div
            className="adminGameProgressFill"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function buildOptionAriaLabel({
  resourcePrefix,
  resourceType,
  levelLabel,
  cost,
  desc,
  position,
  total,
  isSelected,
  isLastSituation,
}) {
  const identity = `${resourcePrefix}. ${levelLabel}. ${cost} ${desc}. Opción ${position} de ${total}.`;

  if (isSelected) {
    if (resourceType === "money") {
      return `${identity} Opción seleccionada. Utilice Tab para avanzar a las opciones de asignar personal.`;
    }
    return isLastSituation
      ? `${identity} Opción seleccionada. Utilice Tab para avanzar hasta el botón Finalizar.`
      : `${identity} Opción seleccionada. Utilice Tab para avanzar hasta el botón Continuar.`;
  }

  return `${identity} Utilice Tab para ir a las demás opciones. Presione Enter para seleccionar.`;
}

function ResourceSelector({
  title,
  resourcePrefix,
  resourceType,
  value,
  options,
  onChange,
  isLastSituation = false,
}) {
  const groupId = useId();
  const total = options.length;

  return (
    <div className="resourceSelector" role="group" aria-labelledby={groupId}>
      <h3 id={groupId} className="resourceSelectorTitle">
        {title}
      </h3>
      <div className="resourceOptions">
        {options.map((opt, index) => {
          const isSelected = value === opt.value;

          return (
            <button
              key={opt.value}
              type="button"
              className={`resourceOption ${isSelected ? "active" : ""}`}
              onClick={() => onChange(opt.value)}
              aria-pressed={isSelected}
              aria-label={buildOptionAriaLabel({
                resourcePrefix,
                resourceType,
                levelLabel: opt.label,
                cost: opt.cost,
                desc: opt.desc,
                position: index + 1,
                total,
                isSelected,
                isLastSituation,
              })}
            >
              <div className="resourceOptionLabel" aria-hidden="true">
                {opt.label}
              </div>
              <div className="resourceOptionCost" aria-hidden="true">
                {opt.cost}
              </div>
              <div className="resourceOptionDesc" aria-hidden="true">
                {opt.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}