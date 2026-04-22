import { useState } from "react";
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

  const handleMoneyChange = (level) => {
    const oldCost = currentAssignment.money
      ? getMoneyCost(currentAssignment.money)
      : 0;
    const newCost = getMoneyCost(level);
    const newBudgetLeft = budgetLeft + oldCost - newCost;

    if (newBudgetLeft < 0) {
      Swal.fire({
        title: "Presupuesto insuficiente 😅",
        text: `No tienes suficiente presupuesto. Te queda ${budgetLeft}% y necesitas ${newCost}%`,
        icon: "warning",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
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
        title: "Personal insuficiente 😅",
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

  const handleContinue = () => {
    if (!currentAssignment.money || !currentAssignment.people) {
      Swal.fire({
        title: "Selecciona ambas opciones 👀",
        text: "Debes asignar tanto presupuesto como personal para esta situación",
        icon: "warning",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
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
          title="🎉 ¡Felicidades!"
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

  const getPreviewScore = () => {
    let score = 0;
    if (currentAssignment.money)
      score += getMoneyScore(currentAssignment.money, current.correct.money);
    if (currentAssignment.people)
      score += getPeopleScore(currentAssignment.people, current.correct.people);
    return score;
  };

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
        <div className="adminGameTopBar">
          <AdminStat
            img={starImg}
            label="REPUTACIÓN"
            value={`${reputation}%`}
            percent={reputation}
          />
          <AdminStat
            img={dollarImg}
            label="PRESUPUESTO"
            value={`${budgetLeft}%`}
            percent={budgetLeft}
          />
          <AdminStat
            img={groupImg}
            label="PERSONAL"
            value={`${staffLeft}%`}
            percent={staffLeft}
          />
        </div>

        <div className="adminGameProgress">
          Situación {step + 1} de {scenarios.length}
        </div>

        <div className="adminGameInstruction">
          🎯 Ayúdame a asignar presupuesto y personal para solucionar la
          siguiente situación
        </div>

        <div className="adminGameNpcContainer">
          <img
            src="/assets/ui/Software/personajes/person.png"
            className="adminGameNpcImg"
            alt="Asesor"
          />
          <div className="adminGameBubble">
            <p className="adminGameBubbleText">"{current.text}"</p>
          </div>
        </div>

        <div className="adminGameControls">
          <ResourceSelector
            title="PRESUPUESTO A ASIGNAR"
            value={currentAssignment.money}
            options={[
              {
                value: "baja",
                label: "💰 Bajo",
                cost: "10%",
                desc: "Inversión mínima",
              },
              {
                value: "media",
                label: "💰💰 Medio",
                cost: "18%",
                desc: "Inversión estándar",
              },
              {
                value: "alta",
                label: "💰💰💰 Alto",
                cost: "25%",
                desc: "Inversión máxima",
              },
            ]}
            onChange={handleMoneyChange}
          />

          <ResourceSelector
            title="PERSONAL A ASIGNAR"
            value={currentAssignment.people}
            options={[
              {
                value: "baja",
                label: "👤 Bajo",
                cost: "8%",
                desc: "Equipo mínimo",
              },
              {
                value: "media",
                label: "👤👤 Medio",
                cost: "15%",
                desc: "Equipo estándar",
              },
              {
                value: "alta",
                label: "👤👤👤 Alto",
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
      <img src={img} className="adminGameIconImg" alt={label} />
      <div className="adminGameStatContent">
        <div className="adminGameLabel">{label}</div>
        <div className="adminGameValueSmall">{value}</div>
        <div className="adminGameProgressBar">
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
  return (
    <div className="resourceSelector">
      <h3 className="resourceSelectorTitle">{title}</h3>
      <div className="resourceOptions">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`resourceOption ${value === opt.value ? "active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            <div className="resourceOptionLabel">{opt.label}</div>
            <div className="resourceOptionCost">{opt.cost}</div>
            <div className="resourceOptionDesc">{opt.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
