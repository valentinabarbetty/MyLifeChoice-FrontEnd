import { useState, useEffect, useRef, useId } from "react";
import starImg from "/public/assets/ui/Administracion/star.png";
import dollarImg from "/public/assets/ui/Administracion/dollar.png";
import groupImg from "/public/assets/ui/Administracion/group.png";
import ConfettiEffect from "../../../ui/Confetti";
import "./AdministracionGame.css";
import GameCompleteModal from "../../../ui/GameCompleteModal/GameCompleteModal";
import Swal from "sweetalert2";

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

  const bubbleTextRef = useRef();

  useEffect(() => {
    if (bubbleTextRef.current) {
      bubbleTextRef.current.focus();
    }
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
  const showAccessibleAlert = async ({ icon, title, text }) => {
    const previouslyFocused = document.activeElement;

    const swalConfig = {
      title,
      text,
      icon,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#f59e0b",
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

  const handlePeopleChange = (level) => {
    const oldCost = currentAssignment.people
      ? getPeopleCost(currentAssignment.people)
      : 0;
    const newCost = getPeopleCost(level);
    const newStaffLeft = staffLeft + oldCost - newCost;

    if (newStaffLeft < 0) {
      Swal.fire({
        title: "Personal insuficiente",
        text: `No tienes suficiente personal. Te queda ${staffLeft}% y necesitas ${newCost}%`,
        icon: "warning",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
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
      });
      return;
    }

    const newReputation =
      reputation + currentAssignment.moneyScore + currentAssignment.peopleScore;
    setReputation(Math.min(100, newReputation));

    if (step === scenarios.length - 1) {
      setGameFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      return;
    }

    setStep((s) => s + 1);
  };

  if (gameFinished) {
    return (
      <>
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

  const getCurrentCost = () => {
    let cost = { money: 0, people: 0 };
    if (currentAssignment.money)
      cost.money = getMoneyCost(currentAssignment.money);
    if (currentAssignment.people)
      cost.people = getPeopleCost(currentAssignment.people);
    return cost;
  };

  const currentCost = getCurrentCost();
  const situationsLeft = scenarios.length - step;
  const totalEarned = assignments.reduce(
    (sum, a) => sum + (a.moneyScore || 0) + (a.peopleScore || 0),
    0,
  );

  return (
    <div className="adminGameOverlay">
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
          tabIndex={0}
          aria-live="polite"
          aria-atomic="true"
          style={{ outline: "none" }}
        >
          Situación {step + 1} de {scenarios.length}
        </div>

        <p
          className="adminGameInstruction"
          tabIndex={0}
          style={{ outline: "none" }}
        >
          Ayúdame a asignar presupuesto y personal para solucionar la siguiente
          situación
        </p>

        <div className="adminGameNpcContainer">
          <img
            src="/assets/ui/Software/personajes/person.png"
            className="adminGameNpcImg"
            alt=""
            aria-hidden="true"
          />
          <div className="adminGameBubble">
            <p
              ref={bubbleTextRef}
              className="adminGameBubbleText"
              tabIndex={0}
              style={{ outline: "none" }}
            >
              {current.text}
            </p>
          </div>
        </div>

        <div className="adminGameControls">
          <ResourceSelector
            title="Presupuesto a asignar"
            value={currentAssignment.money}
            options={[
              {
                value: "baja",
                label: "Bajo",
                cost: "10%",
                desc: "Inversión mínima",
              },
              {
                value: "media",
                label: "Medio",
                cost: "18%",
                desc: "Inversión estándar",
              },
              {
                value: "alta",
                label: "Alto",
                cost: "25%",
                desc: "Inversión máxima",
              },
            ]}
            onChange={handleMoneyChange}
          />
          <ResourceSelector
            title="Personal a asignar"
            value={currentAssignment.people}
            options={[
              {
                value: "baja",
                label: "Bajo",
                cost: "8%",
                desc: "Equipo mínimo",
              },
              {
                value: "media",
                label: "Medio",
                cost: "15%",
                desc: "Equipo estándar",
              },
              {
                value: "alta",
                label: "Alto",
                cost: "25%",
                desc: "Equipo completo",
              },
            ]}
            onChange={handlePeopleChange}
          />
        </div>

        <button className="adminGameBtn" onClick={handleContinue}>
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
          tabIndex={0}
          style={{ outline: "none" }}
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

function ResourceSelector({ title, value, options, onChange }) {
  const groupId = useId();

  return (
    <div className="resourceSelector" role="group" aria-labelledby={groupId}>
      <h3 id={groupId} className="resourceSelectorTitle">
        {title}
      </h3>
      <div className="resourceOptions">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`resourceOption ${value === opt.value ? "active" : ""}`}
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            aria-label={`${opt.label}, costo ${opt.cost}, ${opt.desc}`}
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
        ))}
      </div>
    </div>
  );
}
