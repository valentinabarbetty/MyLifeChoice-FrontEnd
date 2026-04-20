import { useState } from "react";
import ConfettiEffect from "../../../ui/Confetti";
import Swal from "sweetalert2";
import "./ContaduriaGame.css";
import GameCompleteModal from "../../../ui/GameCompleteModal/GameCompleteModal";

const VALORES_CORRECTOS = {
  alquiler: 1400,
  aire: 3000,
  desarrollo: 3700,
  energia: 700,
};

export default function ContaduriaGame({ onComplete }) {
  const [valorAlquiler, setValorAlquiler] = useState(1200);
  const [valorAire, setValorAire] = useState(2500);
  const [valorDesarrollo, setValorDesarrollo] = useState(3000);
  const [valorEnergia, setValorEnergia] = useState(500);

  const [currentFactura, setCurrentFactura] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const FACTURAS = [
    "/assets/ui/Contaduria/factura1.png",
    "/assets/ui/Contaduria/factura2.png",
    "/assets/ui/Contaduria/factura3.png",
    "/assets/ui/Contaduria/factura4.png",
  ];

  const updateAlquiler = (delta) => {
    setValorAlquiler((prev) => Math.max(0, prev + delta));
  };

  const updateAire = (delta) => {
    setValorAire((prev) => Math.max(0, prev + delta));
  };

  const updateDesarrollo = (delta) => {
    setValorDesarrollo((prev) => Math.max(0, prev + delta));
  };

  const updateEnergia = (delta) => {
    setValorEnergia((prev) => Math.max(0, prev + delta));
  };

  const nextFactura = () => {
    setCurrentFactura((prev) => (prev + 1) % FACTURAS.length);
  };

  const prevFactura = () => {
    setCurrentFactura((prev) => (prev === 0 ? FACTURAS.length - 1 : prev - 1));
  };

  const handleCheck = () => {
    const alquilerCorrecto = valorAlquiler === VALORES_CORRECTOS.alquiler;
    const aireCorrecto = valorAire === VALORES_CORRECTOS.aire;
    const desarrolloCorrecto = valorDesarrollo === VALORES_CORRECTOS.desarrollo;
    const energiaCorrecto = valorEnergia === VALORES_CORRECTOS.energia;

    let correctCount = 0;
    if (alquilerCorrecto) correctCount++;
    if (aireCorrecto) correctCount++;
    if (desarrolloCorrecto) correctCount++;
    if (energiaCorrecto) correctCount++;

    const allCorrect = correctCount === 4;

    console.log("=== RESULTADOS DE VALIDACIÓN ===");
    console.log(
      `Alquiler: ${valorAlquiler} (correcto: ${VALORES_CORRECTOS.alquiler}) → ${alquilerCorrecto ? "✅" : "❌"}`,
    );
    console.log(
      `Aire: ${valorAire} (correcto: ${VALORES_CORRECTOS.aire}) → ${aireCorrecto ? "✅" : "❌"}`,
    );
    console.log(
      `Desarrollo: ${valorDesarrollo} (correcto: ${VALORES_CORRECTOS.desarrollo}) → ${desarrolloCorrecto ? "✅" : "❌"}`,
    );
    console.log(
      `Energía: ${valorEnergia} (correcto: ${VALORES_CORRECTOS.energia}) → ${energiaCorrecto ? "✅" : "❌"}`,
    );
    console.log(`Total correctos: ${correctCount} de 4`);

    if (allCorrect) {
   
      setGameFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    } else {

      let errores = [];
      if (!alquilerCorrecto)
        errores.push(`Alquiler: debe ser $${VALORES_CORRECTOS.alquiler}`);
      if (!aireCorrecto)
        errores.push(`Aire acondicionado: debe ser $${VALORES_CORRECTOS.aire}`);
      if (!desarrolloCorrecto)
        errores.push(
          `Servicios desarrollo: debe ser $${VALORES_CORRECTOS.desarrollo}`,
        );
      if (!energiaCorrecto)
        errores.push(
          `Servicios energía: debe ser $${VALORES_CORRECTOS.energia}`,
        );

      Swal.fire({
        title: "📋 Valores incorrectos",
        icon: "warning",
        confirmButtonText: "Revisar de nuevo",
        confirmButtonColor: "#22c55e",
        background: "#fef7e7",
        backdrop: `rgba(0,0,0,0.4)`,
      });
    }
  };

  if (gameFinished) {
    return (
      <>
        {showConfetti && <ConfettiEffect />}
        <GameCompleteModal
          title="🎉 ¡Felicidades!"
          message="¡Has completado el desafío de contaduría pública!"
          extra={
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <p style={{ fontSize: "16px", color: "#22c55e" }}>
                ¡Excelente trabajo detective!
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                Has corregido todos los gastos correctamente
              </p>
            </div>
          }
          onContinue={() => onComplete?.()}
        />
      </>
    );
  }

  return (
    <div className="contaduriaOverlay">
      <div className="contaduriaPanel">
        <div className="contaduriaHeader">
          <div className="contaduriaIcon">🕵️</div>
          <div>
            <h1 className="contaduriaTitle">Detective de cuentas</h1>
            <p className="contaduriaSubtitle">
              Corrige los errores en el libro de gastos usando las facturas
            </p>
          </div>
        </div>

        <div className="contaduriaContent">
          <div className="contaduriaTable">
            <div className="contaduriaTableHeader">
              <span>📅 FECHA</span>
              <span>📝 DESCRIPCIÓN</span>
              <span>💰 VALOR</span>
            </div>

            <div className="contaduriaTableBody">
              <div
                className={`contaduriaRow ${0 === currentFactura ? "contaduriaRowActive" : ""}`}
              >
                <span className="contaduriaFecha">12/03</span>
                <span className="contaduriaDescripcion">Alquiler</span>
                <div className="contaduriaValueBox">
                  <button
                    className="contaduriaBtnMinus"
                    onClick={() => updateAlquiler(-100)}
                  >
                    −
                  </button>
                  <span className="contaduriaValor">
                    ${valorAlquiler.toLocaleString()}
                  </span>
                  <button
                    className="contaduriaBtnPlus"
                    onClick={() => updateAlquiler(100)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div
                className={`contaduriaRow ${1 === currentFactura ? "contaduriaRowActive" : ""}`}
              >
                <span className="contaduriaFecha">22/08</span>
                <span className="contaduriaDescripcion">
                  Aire acondicionado
                </span>
                <div className="contaduriaValueBox">
                  <button
                    className="contaduriaBtnMinus"
                    onClick={() => updateAire(-100)}
                  >
                    −
                  </button>
                  <span className="contaduriaValor">
                    ${valorAire.toLocaleString()}
                  </span>
                  <button
                    className="contaduriaBtnPlus"
                    onClick={() => updateAire(100)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div
                className={`contaduriaRow ${2 === currentFactura ? "contaduriaRowActive" : ""}`}
              >
                <span className="contaduriaFecha">02/04</span>
                <span className="contaduriaDescripcion">
                  Servicios desarrollo
                </span>
                <div className="contaduriaValueBox">
                  <button
                    className="contaduriaBtnMinus"
                    onClick={() => updateDesarrollo(-100)}
                  >
                    −
                  </button>
                  <span className="contaduriaValor">
                    ${valorDesarrollo.toLocaleString()}
                  </span>
                  <button
                    className="contaduriaBtnPlus"
                    onClick={() => updateDesarrollo(100)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div
                className={`contaduriaRow ${3 === currentFactura ? "contaduriaRowActive" : ""}`}
              >
                <span className="contaduriaFecha">08/12</span>
                <span className="contaduriaDescripcion">Servicios energía</span>
                <div className="contaduriaValueBox">
                  <button
                    className="contaduriaBtnMinus"
                    onClick={() => updateEnergia(-100)}
                  >
                    −
                  </button>
                  <span className="contaduriaValor">
                    ${valorEnergia.toLocaleString()}
                  </span>
                  <button
                    className="contaduriaBtnPlus"
                    onClick={() => updateEnergia(100)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="contaduriaReceipts">
            <div className="contaduriaReceiptsHeader">
              <span>📄 FACTURAS Y RECIBOS</span>
              <span className="contaduriaHint">💡 Haz clic en las flechas</span>
            </div>

            <div className="contaduriaCarousel">
              <button className="contaduriaArrow" onClick={prevFactura}>
                ◀
              </button>
              <div className="contaduriaImageContainer">
                <img
                  src={FACTURAS[currentFactura]}
                  className="contaduriaFacturaImg"
                  alt={`Factura ${currentFactura + 1}`}
                />
                <div className="contaduriaImageOverlay">
                  <span>
                    Factura {currentFactura + 1} de {FACTURAS.length}
                  </span>
                </div>
              </div>
              <button className="contaduriaArrow" onClick={nextFactura}>
                ▶
              </button>
            </div>

            <div className="contaduriaDots">
              {FACTURAS.map((_, i) => (
                <button
                  key={i}
                  className={`contaduriaDot ${i === currentFactura ? "contaduriaDotActive" : ""}`}
                  onClick={() => setCurrentFactura(i)}
                />
              ))}
            </div>

            <div className="contaduriaProgress">
              <div className="contaduriaProgressText">
                <span>Progreso</span>
                <span>
                  {currentFactura + 1}/{FACTURAS.length}
                </span>
              </div>
              <div className="contaduriaProgressBar">
                <div
                  className="contaduriaProgressFill"
                  style={{
                    width: `${((currentFactura + 1) / FACTURAS.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <button className="contaduriaBtn" onClick={handleCheck}>
          Validar gastos
        </button>
      </div>
    </div>
  );
}
