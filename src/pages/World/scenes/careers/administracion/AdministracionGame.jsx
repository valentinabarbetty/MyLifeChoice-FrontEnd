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
      context: "Un cliente estratégico reporta un fallo grave en el servicio.",
      impact: "Si no se soluciona rápido, podrías perder el contrato y afectar la reputación.",
      decision: "¿Cuántos recursos asignas para resolverlo?",
      correct: {
        money: { min: 30000, max: 80000 },
        people: { min: 3, max: 7 },
      },
    },
    {
      title: "FALLA EN PRODUCCIÓN",
      context: "El sistema principal dejó de funcionar.",
      impact: "La producción está detenida y hay pérdidas económicas.",
      decision: "Debes reaccionar rápido.",
      correct: {
        money: { min: 50000, max: 90000 },
        people: { min: 4, max: 8 },
      },
    },
    {
      title: "EQUIPO DESMOTIVADO",
      context: "El equipo ha bajado su rendimiento significativamente.",
      impact: "La productividad está disminuyendo y hay riesgo de rotación.",
      decision: "¿Cómo motivas al equipo?",
      correct: {
        money: { min: 10000, max: 40000 },
        people: { min: 2, max: 5 },
      },
    },
    {
      title: "EXPANSIÓN INTERNACIONAL",
      context: "Se abre una oportunidad de negocio en el extranjero.",
      impact: "Podrías aumentar ingresos pero requiere inversión inicial.",
      decision: "¿Cuánto inviertes y cuántas personas asignas?",
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

  return (
    <div className="adminGameOverlay">
      <div className="adminGamePanel">
        <div className="adminGameTopBar">
          <AdminStat img={starImg} label="REPUTACIÓN" value={`${reputation}%`} percent={reputation} />
          <AdminStat img={dollarImg} label="PRESUPUESTO" value={`$${budgetTotal.toLocaleString()}`} percent={(budgetTotal / 450000) * 100} />
          <AdminStat img={groupImg} label="PERSONAL" value={`${staffTotal} empleados`} percent={(staffTotal / 50) * 100} />
        </div>

        <div className="adminGameCard">
          <div className="adminGameCardHeader">
            <span className="adminGameBadge">⚠️ SITUACIÓN CRÍTICA</span>
            <h2 className="adminGameTitle">{current.title}</h2>
          </div>

          <div className="adminGameCardBody">
            <div className="adminGameInfoRow">
              <span className="adminGameInfoIcon">📋</span>
              <div className="adminGameInfoContent">
                <p className="adminGameContext">{current.context}</p>
              </div>
            </div>

            <div className="adminGameInfoRow">
              <span className="adminGameInfoIcon">⚠️</span>
              <div className="adminGameInfoContent">
                <p className="adminGameImpact">{current.impact}</p>
              </div>
            </div>

            <div className="adminGameInfoRow">
              <span className="adminGameInfoIcon">💡</span>
              <div className="adminGameInfoContent">
                <p className="adminGameDecision">{current.decision}</p>
              </div>
            </div>
          </div>

          <div className="adminGameCardFooter">
            <span className="adminGameHint">💰 ${current.correct.money.min.toLocaleString()} - ${current.correct.money.max.toLocaleString()} | 👥 {current.correct.people.min}-{current.correct.people.max} personas</span>
          </div>
        </div>

        <div className="adminGameControls">
          <AdminControl title="PRESUPUESTO" value={`$${money.toLocaleString()}`} onAdd={() => handleBudget(INCREMENTO)} onRemove={() => handleBudget(-INCREMENTO)} />
          <AdminControl title="PERSONAL" value={people} onAdd={() => handleStaff(1)} onRemove={() => handleStaff(-1)} />
        </div>

        <button className="adminGameBtn" onClick={handleContinue}>
          Continuar
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
          <div className="adminGameProgressFill" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}

function AdminControl({ title, value, onAdd, onRemove }) {
  return (
    <div className="adminGameControl">
      <h3 className="adminGameControlTitle">{title}</h3>
      <div className="adminGameControlValue">{value}</div>
      <div className="adminGameBtnRow">
        <button className="adminGameMinus" onClick={onRemove}>−</button>
        <button className="adminGamePlus" onClick={onAdd}>+</button>
        
      </div>
    </div>
  );
}