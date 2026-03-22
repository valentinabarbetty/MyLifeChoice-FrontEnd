import { useState } from "react";
import starImg from "/public/assets/ui/Administracion/star.png";
import dollarImg from "/public/assets/ui/Administracion/dollar.png";
import groupImg from "/public/assets/ui/Administracion/group.png";
import ConfettiEffect from "../../../ui/Confetti";
import "./AdministracionGame.css";
import GameCompleteModal from "../../../ui/GameCompleteModal/GameCompleteModal";

const INCREMENTO = 10000;

export default function AdministracionGame({ onComplete }) {
  const scenarios = [
    {
      title: "RECLAMO DE CUENTA CLAVE",
      text: "Cliente importante con problema grave.",
      correct: {
        money: { min: 30000, max: 80000 },
        people: { min: 3, max: 7 },
      },
    },
    {
      title: "FALLA EN PRODUCCIÓN",
      text: "Sistema crítico dejó de funcionar.",
      correct: {
        money: { min: 50000, max: 90000 },
        people: { min: 4, max: 8 },
      },
    },
    {
      title: "EQUIPO DESMOTIVADO",
      text: "El equipo ha bajado rendimiento.",
      correct: {
        money: { min: 10000, max: 40000 },
        people: { min: 2, max: 5 },
      },
    },
    {
      title: "EXPANSIÓN INTERNACIONAL",
      text: "Se abre oportunidad en otro país.",
      correct: {
        money: { min: 60000, max: 120000 },
        people: { min: 5, max: 9 },
      },
    },
  ];

  const [gameFinished, setGameFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [reputation, setReputation] = useState(0);
  const [budgetTotal, setBudgetTotal] = useState(450000);
  const [staffTotal, setStaffTotal] = useState(50);
  const [money, setMoney] = useState(0);
  const [people, setPeople] = useState(0);
  const [step, setStep] = useState(0);

  const current = scenarios[step];

  const handleBudget = (delta) => {
    if (delta > 0) {
      if (budgetTotal < INCREMENTO) return;
      setMoney((m) => m + INCREMENTO);
      setBudgetTotal((b) => b - INCREMENTO);
    } else {
      if (money <= 0) return;
      setMoney((m) => m - INCREMENTO);
      setBudgetTotal((b) => b + INCREMENTO);
    }
  };

  const handleStaff = (delta) => {
    if (delta > 0) {
      if (staffTotal <= 0) return;
      setPeople((p) => p + 1);
      setStaffTotal((s) => s - 1);
    } else {
      if (people <= 0) return;
      setPeople((p) => p - 1);
      setStaffTotal((s) => s + 1);
    }
  };

  const handleContinue = () => {
    const { money: mRange, people: pRange } = current.correct;

    const moneyOk = money >= mRange.min && money <= mRange.max;
    const peopleOk = people >= pRange.min && people <= pRange.max;

    let score = 0;

    if (moneyOk && peopleOk) score = 20;
    else if (moneyOk || peopleOk) score = 10;
    else score = -5;

    setReputation((r) => Math.max(0, r + score));

    if (step === scenarios.length - 1) {
      setGameFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      return;
    }

    setStep((s) => s + 1);
    setMoney(0);
    setPeople(0);
  };
if (gameFinished) {
  return (
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
  );
}

  return (
    <div className="overlay">
      <div className="panel">

        <div className="topBar">
          <Stat img={starImg} label="REPUTACIÓN" value={`${reputation}%`} percent={reputation} />
          <Stat img={dollarImg} label="PRESUPUESTO" value={`$${budgetTotal.toLocaleString()}`} percent={(budgetTotal / 450000) * 100} />
          <Stat img={groupImg} label="PERSONAL" value={`${staffTotal} empleados`} percent={(staffTotal / 50) * 100} />
        </div>

        <div className="instructions">
          Ayúdame a mantener la empresa estable.
        </div>

        <div className="card">
          <div className="badge">SITUACIÓN ACTUAL</div>
          <h2 className="title">{current.title}</h2>
          <p className="text">{current.text}</p>
        </div>

        <div className="controls">
          <Control title="PRESUPUESTO" value={`$${money.toLocaleString()}`} onAdd={() => handleBudget(INCREMENTO)} onRemove={() => handleBudget(-INCREMENTO)} />
          <Control title="PERSONAL" value={`${people}`} onAdd={() => handleStaff(1)} onRemove={() => handleStaff(-1)} />
        </div>

        <button className="btn" onClick={handleContinue}>
          CONTINUAR ↑
        </button>
      </div>
    </div>
  );
}

function Stat({ img, label, value, percent }) {
  return (
    <div className="stat">
      <img src={img} className="iconImg" />
      <div style={{ width: "100%" }}>
        <div className="label">{label}</div>
        <div className="valueSmall">{value}</div>
        <div className="progressBar">
          <div className="progressFill" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}

function Control({ title, value, onAdd, onRemove }) {
  return (
    <div className="control">
      <h3>{title}</h3>
      <div className="value">{value}</div>
      <div className="btnRow">
        <button className="plus" onClick={onAdd}>+</button>
        <button className="minus" onClick={onRemove}>−</button>
      </div>
    </div>
  );
}