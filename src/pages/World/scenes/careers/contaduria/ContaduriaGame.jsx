import { useState } from "react";
import ConfettiEffect from "../../../ui/Confetti";
import Swal from "sweetalert2";
import "./ContaduriaGame.css";
import GameCompleteModal from "../../../ui/GameCompleteModal/GameCompleteModal";

const DATA = [
  {
    id: 0,
    fecha: "12/03",
    descripcion: "Alquiler",
    valor: 1200,
    correcto: 1400,
  },
  {
    id: 1,
    fecha: "22/08",
    descripcion: "Aire acondicionado",
    valor: 2500,
    correcto: 3000,
  },
  {
    id: 2,
    fecha: "02/04",
    descripcion: "Servicios desarrollo",
    valor: 3000,
    correcto: 3700,
  },
  {
    id: 3,
    fecha: "08/12",
    descripcion: "Servicios energía",
    valor: 500,
    correcto: 700,
  },
];

export default function ContaduriaGame({ onComplete }) {
  const [rows, setRows] = useState(DATA);
  const [currentFactura, setCurrentFactura] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const FACTURAS = [
    "/assets/ui/Contaduria/factura1.png",
    "/assets/ui/Contaduria/factura2.png",
    "/assets/ui/Contaduria/factura3.png",
    "/assets/ui/Contaduria/factura4.png",
  ];

  const updateValue = (index, delta) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, valor: Math.max(0, row.valor + delta) } : row,
      ),
    );
  };

  const nextFactura = () => {
    setCurrentFactura((prev) => (prev + 1) % FACTURAS.length);
  };

  const prevFactura = () => {
    setCurrentFactura((prev) => (prev === 0 ? FACTURAS.length - 1 : prev - 1));
  };

  const handleCheck = () => {
    let correctCount = 0;

    rows.forEach((r) => {
      const diff = Math.abs(r.valor - r.correcto);
      if (diff <= 100) correctCount++;
    });

    if (correctCount >= 3) {
      setGameFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    } else {
      Swal.fire({
        title: "Casi lo logras 😅",
        text: "Revisa bien las facturas y vuelve a intentar",
        icon: "warning",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
        backdrop: `rgba(0,0,0,0.4)`,
      });
    }
  };

  if (gameFinished) {
    return (
      <GameCompleteModal
        title="🎉 ¡Felicidades!"
        message="Has completado el desafío de contaduría pública."
        onContinue={() => onComplete?.()}
      />
    );
  }

  return (
    <div className="overlay">
      <div className="panel">
        <h1 className="title">Detective de cuentas 🕵️</h1>

        <p className="subtitle">
          Corrige los errores en el libro de gastos usando las facturas.
        </p>

        <div className="content">
          <div className="table">
            <h3>LIBRO DIARIO DE GASTOS</h3>

            {rows.map((row, i) => (
              <div
                key={i}
                className={`row ${i === currentFactura ? "row-active" : ""}`}
              >
                <span>{row.fecha}</span>
                <span>{row.descripcion}</span>

                <div className="valueBox">
                  <button onClick={() => updateValue(i, -100)}>-</button>
                  <span>${row.valor}</span>
                  <button onClick={() => updateValue(i, 100)}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="receipts">
            <h3>FACTURAS Y RECIBOS</h3>

            <div className="carousel">
              <button className="arrow" onClick={prevFactura}>
                ←
              </button>

              <img src={FACTURAS[currentFactura]} className="facturaImg" />

              <button className="arrow" onClick={nextFactura}>
                →
              </button>
            </div>

            <div className="dots">
              {FACTURAS.map((_, i) => (
                <div
                  key={i}
                  className={`dot ${i === currentFactura ? "dot-active" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>

        <button className="btn" onClick={handleCheck}>
          Validar
        </button>
      </div>
    </div>
  );
}
