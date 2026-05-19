import { useState, useEffect, useRef } from "react";
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

const FILAS = [
  { key: "alquiler", fecha: "12/03", descripcion: "Alquiler", facturaIndex: 0 },
  {
    key: "aire",
    fecha: "22/08",
    descripcion: "Aire acondicionado",
    facturaIndex: 1,
  },
  {
    key: "desarrollo",
    fecha: "02/04",
    descripcion: "Servicios desarrollo",
    facturaIndex: 2,
  },
  {
    key: "energia",
    fecha: "08/12",
    descripcion: "Servicios energía",
    facturaIndex: 3,
  },
];

const FACTURAS = [
  "/assets/ui/Contaduria/factura1.png",
  "/assets/ui/Contaduria/factura2.png",
  "/assets/ui/Contaduria/factura3.png",
  "/assets/ui/Contaduria/factura4.png",
];

const DESCRIPCIONES_FACTURAS = [
  {
    titulo: "Recibo de Alquiler",
    fecha: "12 de marzo 2025",
    direccion: "Calle 34 Ave 2",
    cliente: "Juan Gómez",
    conceptos: [
      { nombre: "Alquiler mes de febrero", valor: "$1,200" },
      { nombre: "Impuestos", valor: "$200" },
    ],
    total: "$1,400",
    explicacion:
      "Esta factura muestra un alquiler de $1,200 más $200 de impuestos, dando un total de $1,400.",
  },
  {
    titulo: "Recibo de Aire Acondicionado",
    fecha: "22 agosto 2025",
    direccion: "Carrera 32",
    cliente: "José Pérez",
    conceptos: [
      { nombre: "Aire acondicionado", valor: "$2,300" },
      { nombre: "Instalación", valor: "$700" },
    ],
    total: "$3,000",
    explicacion:
      "Esta factura muestra un aire acondicionado de $2,300 más instalación de $700, dando un total de $3,000.",
  },
  {
    titulo: "Recibo de Servicios de Desarrollo",
    fecha: "2 abril 2025",
    direccion: "Ave 5ta 32",
    cliente: "María Martínez",
    conceptos: [
      { nombre: "Desarrollo aplicación", valor: "$3,500" },
      { nombre: "Servidor", valor: "$200" },
    ],
    total: "$3,700",
    explicacion:
      "Esta factura muestra desarrollo de aplicación de $3,500 más servidor de $200, dando un total de $3,700.",
  },
  {
    titulo: "Recibo de Servicios de Energía",
    fecha: "8 diciembre 2026",
    direccion: "Calle 78 56 - 7",
    cliente: "María Martínez",
    conceptos: [{ nombre: "Consumo de energía", valor: "$700" }],
    total: "$700",
    explicacion:
      "Esta factura muestra consumo de energía de $700, dando un total de $700.",
  },
];

export default function ContaduriaGame({ onComplete }) {
  const [valores, setValores] = useState({
    alquiler: 1200,
    aire: 2500,
    desarrollo: 3000,
    energia: 500,
  });
  const showAccessibleAlert = async ({ icon, title, text }) => {
    const previouslyFocused = document.activeElement;

    const swalConfig = {
      title,
      text,
      icon,
      confirmButtonText: "Revisar de nuevo",
      confirmButtonColor: "#f59e0b",
      background: "#fef7e7",
      backdrop: "rgba(0,0,0,0.4)",
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
  const [currentFactura, setCurrentFactura] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const titleRef = useRef(null);
  const announcerRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => {
      titleRef.current?.focus();
    }, 100);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!announcerRef.current || !announcement) return;
    announcerRef.current.textContent = "";
    requestAnimationFrame(() => {
      if (announcerRef.current) announcerRef.current.textContent = announcement;
    });
  }, [announcement]);

  const updateValor = (key, delta) => {
    setValores((prev) => {
      const next = Math.max(0, prev[key] + delta);
      const fila = FILAS.find((f) => f.key === key);
      setAnnouncement(`${fila.descripcion}: $${next.toLocaleString()}`);
      return { ...prev, [key]: next };
    });
  };

  const goToFactura = (index) => {
    setCurrentFactura(index);
    const fila = FILAS.find((f) => f.facturaIndex === index);
    const descripcion = DESCRIPCIONES_FACTURAS[index];

    setAnnouncement(
      `Factura ${index + 1} de ${FACTURAS.length}. ${descripcion.titulo}. ` +
        `Fecha: ${descripcion.fecha}. Cliente: ${descripcion.cliente}. ` +
        `Dirección: ${descripcion.direccion}. ${descripcion.explicacion}`,
    );
  };

  const nextFactura = () => goToFactura((currentFactura + 1) % FACTURAS.length);
  const prevFactura = () =>
    goToFactura(
      currentFactura === 0 ? FACTURAS.length - 1 : currentFactura - 1,
    );

  const handleCheck = async () => {
    const resultados = FILAS.map((f) => ({
      ...f,
      correcto: valores[f.key] === VALORES_CORRECTOS[f.key],
    }));
    const allCorrect = resultados.every((r) => r.correcto);

    if (allCorrect) {
      setAnnouncement("¡Felicidades! Todos los gastos son correctos.");
      setGameFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    } else {
      const incorrectos = resultados
        .filter((r) => !r.correcto)
        .map(
          (r) =>
            `${r.descripcion}: debe ser $${VALORES_CORRECTOS[r.key].toLocaleString()}`,
        )
        .join(". ");

      setAnnouncement(`Valores incorrectos.`);

      await showAccessibleAlert({
        icon: "warning",
        title: "📋 Valores incorrectos",
        text: `Valores incorrectos.`,
      });
    }
  };
  const getFacturaAriaLabel = () => {
    const desc = DESCRIPCIONES_FACTURAS[currentFactura];
    const conceptosTexto = desc.conceptos
      .map((c) => `${c.nombre}: ${c.valor}`)
      .join(", ");
    return `${desc.titulo}. Fecha: ${desc.fecha}. Dirección: ${desc.direccion}. Cliente: ${desc.cliente}. Conceptos: ${conceptosTexto}. Total: ${desc.total}. ${desc.explicacion}`;
  };

  if (gameFinished) {
    return (
      <>
        {showConfetti && <ConfettiEffect />}
        <GameCompleteModal
          title="¡Felicidades!"
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
      <div
        ref={announcerRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
      <div
        className="contaduriaPanel"
        role="region"
        aria-labelledby="contaduria-title"
        aria-describedby="contaduria-instructions"
      >
        <div id="contaduria-instructions" className="sr-only">
          Revisa las facturas del carrusel y ajusta los valores del libro de
          gastos usando los botones más y menos. Cuando todos los valores sean
          correctos, presiona Validar gastos.
        </div>

        <div className="contaduriaHeader">
          <div className="contaduriaIcon" aria-hidden="true">
            🕵️
          </div>
          <div>
            <h1
              id="contaduria-title"
              ref={titleRef}
              tabIndex={-1}
              className="contaduriaTitle"
              aria-live="polite"
            >
              Detective de cuentas
            </h1>
            <p id="contaduria-subtitle" className="contaduriaSubtitle">
              Corrige los errores en el libro de gastos usando las facturas
            </p>
          </div>
        </div>

        <div className="contaduriaContent">
          <div
            className="contaduriaReceipts"
            role="region"
            aria-label="Carrusel de facturas y recibos"
          >
            <div className="contaduriaReceiptsHeader">
              <span aria-hidden="true">📄 FACTURAS Y RECIBOS</span>
              <span className="contaduriaHint" aria-hidden="true">
                💡 Haz clic en las flechas
              </span>
            </div>

            <div
              className="contaduriaCarousel"
              aria-roledescription="carrusel"
              aria-label="Facturas"
            >
              <button
                className="contaduriaArrow"
                onClick={prevFactura}
                aria-label="Factura anterior"
              >
                <span aria-hidden="true">◀</span>
              </button>

              <div
                className="contaduriaImageContainer"
                role="img"
                aria-label={getFacturaAriaLabel()}
              >
                <img
                  src={FACTURAS[currentFactura]}
                  className="contaduriaFacturaImg"
                  alt=""
                  aria-hidden="true"
                />

                <div className="contaduriaImageOverlay" aria-hidden="true">
                  <div className="factura-info-overlay">
                    <strong>
                      {DESCRIPCIONES_FACTURAS[currentFactura].titulo}
                    </strong>
                    <span>
                      Total: {DESCRIPCIONES_FACTURAS[currentFactura].total}
                    </span>
                    <span>
                      Cliente: {DESCRIPCIONES_FACTURAS[currentFactura].cliente}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="contaduriaArrow"
                onClick={nextFactura}
                aria-label="Siguiente factura"
              >
                <span aria-hidden="true">▶</span>
              </button>
            </div>

            <div
              className="contaduriaDots"
              role="tablist"
              aria-label="Seleccionar factura"
            >
              {FACTURAS.map((_, i) => (
                <button
                  key={i}
                  className={`contaduriaDot ${i === currentFactura ? "contaduriaDotActive" : ""}`}
                  role="tab"
                  aria-selected={i === currentFactura}
                  aria-label={`Factura ${i + 1}: ${DESCRIPCIONES_FACTURAS[i].titulo}. Total: ${DESCRIPCIONES_FACTURAS[i].total}. Cliente: ${DESCRIPCIONES_FACTURAS[i].cliente}`}
                  onClick={() => goToFactura(i)}
                />
              ))}
            </div>
            <div className="contaduriaProgress" aria-hidden="true">
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
          <div
            className="contaduriaTable"
            role="table"
            aria-label="Libro de gastos"
          >
            <div className="contaduriaTableHeader" role="row">
              <span role="columnheader">Fecha</span>
              <span role="columnheader">Descripción</span>
              <span role="columnheader">Valor</span>
            </div>

            <div className="contaduriaTableBody" role="rowgroup">
              {FILAS.map((fila) => (
                <div
                  key={fila.key}
                  className={`contaduriaRow ${fila.facturaIndex === currentFactura ? "contaduriaRowActive" : ""}`}
                  role="row"
                  aria-current={
                    fila.facturaIndex === currentFactura ? "true" : undefined
                  }
                >
                  <span className="contaduriaFecha" role="cell">
                    {fila.fecha}
                  </span>
                  <span className="contaduriaDescripcion" role="cell">
                    {fila.descripcion}
                  </span>

                  <div className="contaduriaValueBox" role="cell">
                    <button
                      className="contaduriaBtnMinus"
                      onClick={() => updateValor(fila.key, -100)}
                      aria-label={`Reducir ${fila.descripcion} en $100. Valor actual: $${valores[fila.key].toLocaleString()}`}
                    >
                      <span aria-hidden="true">−</span>
                    </button>

                    <span
                      className="contaduriaValor"
                      aria-live="polite"
                      aria-label={`${fila.descripcion}: $${valores[fila.key].toLocaleString()}`}
                    >
                      ${valores[fila.key].toLocaleString()}
                    </span>

                    <button
                      className="contaduriaBtnPlus"
                      onClick={() => updateValor(fila.key, 100)}
                      aria-label={`Aumentar ${fila.descripcion} en $100. Valor actual: $${valores[fila.key].toLocaleString()}`}
                    >
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className="contaduriaBtn"
          onClick={handleCheck}
          aria-label="Validar gastos del libro de cuentas"
        >
          Validar gastos
        </button>
      </div>
    </div>
  );
}
