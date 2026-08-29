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

const UNIDADES = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
const DIECIS = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
const DECENAS = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const CENTENAS = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

function convertirDecenas(n) {
  if (n < 10) return UNIDADES[n];
  if (n < 20) return DIECIS[n - 10];
  if (n < 30) return n === 20 ? "veinte" : `veinti${UNIDADES[n - 20]}`;
  const decena = Math.floor(n / 10);
  const unidad = n % 10;
  return unidad === 0 ? DECENAS[decena] : `${DECENAS[decena]} y ${UNIDADES[unidad]}`;
}

function convertirCentenas(n) {
  if (n === 100) return "cien";
  const centena = Math.floor(n / 100);
  const resto = n % 100;
  let texto = centena > 0 ? CENTENAS[centena] : "";
  if (resto > 0) texto += (texto ? " " : "") + convertirDecenas(resto);
  return texto;
}

function numeroAPalabras(numero) {
  const n = Math.round(Math.abs(Number(numero) || 0));
  if (n === 0) return "cero";

  let restante = n;
  const millones = Math.floor(restante / 1000000);
  restante %= 1000000;
  const miles = Math.floor(restante / 1000);
  restante %= 1000;

  let texto = "";
  if (millones > 0) {
    texto += millones === 1 ? "un millón" : `${convertirCentenas(millones)} millones`;
  }
  if (miles > 0) {
    texto += (texto ? " " : "") + (miles === 1 ? "mil" : `${convertirCentenas(miles)} mil`);
  }
  if (restante > 0) {
    texto += (texto ? " " : "") + convertirCentenas(restante);
  }
  return texto.trim();
}

const formatearPesosHablado = (monto) => `${numeroAPalabras(monto)} pesos`;

const sanitizeMoneyMentionsForSpeech = (text = "") =>
  text.replace(/\$\s?([\d.,]+)/g, (_match, digits) => {
    const numero = Number(digits.replace(/[.,]/g, ""));
    return formatearPesosHablado(numero);
  });

const getFacturaTabHint = (index) => {
  const isLast = index === FACTURAS.length - 1;
  return isLast
    ? "Esta es la última factura. Presiona Tab para ir al libro de gastos y comenzar a corregir los valores con los botones menos y más."
    : "Presiona Tab para ir a la siguiente factura.";
};

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
      setAnnouncement(`Valor actual del libro de gastos: ${formatearPesosHablado(next)}.`);
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
        `Dirección: ${descripcion.direccion}. ${sanitizeMoneyMentionsForSpeech(descripcion.explicacion)}`,
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
      .map((c) => `${c.nombre}: ${sanitizeMoneyMentionsForSpeech(c.valor)}`)
      .join(", ");
    return `${desc.titulo}. Fecha: ${desc.fecha}. Dirección: ${desc.direccion}. Cliente: ${desc.cliente}. Conceptos: ${conceptosTexto}. Total: ${sanitizeMoneyMentionsForSpeech(desc.total)}. ${sanitizeMoneyMentionsForSpeech(desc.explicacion)}`;
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
      <div className="contaduriaPanel">
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
              aria-describedby="contaduria-title-hint"
            >
              Detective de cuentas
            </h1>
            <p id="contaduria-subtitle" className="contaduriaSubtitle">
              Corrige los errores en el libro de gastos usando las facturas
            </p>
            <span id="contaduria-title-hint" className="sr-only">
              A continuación encontrarás cuatro facturas y un libro de
              gastos. Debes corregir los valores del libro de gastos de
              acuerdo con la información de las facturas. Presiona Tab
              para ir a las facturas.
            </span>
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
                tabIndex={-1}
                aria-hidden="true"
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
                tabIndex={-1}
                aria-hidden="true"
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
                  aria-label={`Factura ${i + 1} de ${FACTURAS.length}: ${DESCRIPCIONES_FACTURAS[i].titulo}. Total: ${sanitizeMoneyMentionsForSpeech(DESCRIPCIONES_FACTURAS[i].total)}. Cliente: ${DESCRIPCIONES_FACTURAS[i].cliente}. ${getFacturaTabHint(i)}`}
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
            <span id="libro-gastos-hint" className="sr-only">
              Libro de gastos. Utiliza los botones menos y más para corregir
              los valores según la información de las facturas.
            </span>

            <div className="contaduriaTableHeader" role="row">
              <span role="columnheader">Fecha</span>
              <span role="columnheader">Descripción</span>
              <span role="columnheader">Valor</span>
            </div>

            <div className="contaduriaTableBody" role="rowgroup">
              {FILAS.map((fila, filaIndex) => {
                const isLastControl = filaIndex === FILAS.length - 1;

                return (
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
                      aria-label={`Valor de la factura: ${formatearPesosHablado(VALORES_CORRECTOS[fila.key])}. Valor actual del libro de gastos: ${formatearPesosHablado(valores[fila.key])}. Botón menos. Presiona Enter para disminuir el valor. Utiliza Tab para ir al botón más.`}
                      aria-describedby={filaIndex === 0 ? "libro-gastos-hint" : undefined}
                    >
                      <span aria-hidden="true">−</span>
                    </button>

                    <span
                      className="contaduriaValor"
                      aria-label={`${fila.descripcion}: ${formatearPesosHablado(valores[fila.key])}`}
                    >
                      ${valores[fila.key].toLocaleString()}
                    </span>

                    <button
                      className="contaduriaBtnPlus"
                      onClick={() => updateValor(fila.key, 100)}
                      aria-label={`Valor de la factura: ${formatearPesosHablado(VALORES_CORRECTOS[fila.key])}. Valor actual del libro de gastos: ${formatearPesosHablado(valores[fila.key])}. Botón más. Presiona Enter para aumentar el valor.${isLastControl ? " Este es el último valor. Presiona Tab para ir al botón Validar y luego presiona Enter para validar la información." : ""}`}
                    >
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>
                </div>
                );
              })}
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