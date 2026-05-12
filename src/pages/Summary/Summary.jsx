import React, {
  useMemo,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { jsPDF } from "jspdf";
import { getUserFeedback } from "../../services/userService";
import { NPCS } from "../World/data/npcsInfo";
import "./Summary.css";

function generatePDFReport(allProcessed, playerName) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 16;
  const CW = W - M * 2;

  const C = {
    amber: [245, 158, 11],
    amberLight: [254, 243, 199],
    amberBorder: [253, 230, 138],
    creamDark: [254, 247, 231],
    slate800: [30, 41, 59],
    slate500: [100, 116, 139],
    slate200: [226, 232, 240],
    white: [255, 255, 255],
    gold1st: [245, 158, 11],
    silver2nd: [148, 163, 184],
    bronze3rd: [180, 120, 60],
    dark: [15, 23, 42],
  };

  const sf = (c) => doc.setFillColor(...c);
  const sd = (c) => doc.setDrawColor(...c);
  const st = (c) => doc.setTextColor(...c);
  const fn = (style = "normal") => doc.setFont("helvetica", style);
  const fs = (s) => doc.setFontSize(s);

  const rr = (x, y, w, h, r, mode = "F") => {
    if (w <= 0 || h <= 0) return;
    const safeR = Math.max(0, Math.min(r, w / 2, h / 2));
    doc.roundedRect(x, y, w, h, safeR, safeR, mode);
  };

  const sep = (y, color = C.slate200, lw = 0.3) => {
    sd(color);
    doc.setLineWidth(lw);
    doc.line(M, y, W - M, y);
    doc.setLineWidth(0.3);
  };

  const rankColor = (i) =>
    i === 0
      ? C.gold1st
      : i === 1
        ? C.silver2nd
        : i === 2
          ? C.bronze3rd
          : C.slate200;

  const ROW_H = 22;
  const ROW_GAP = 3;
  const HEADER = 24;
  const FOOTER = 16;
  const USABLE = H - HEADER - FOOTER;
  const PER_PAGE = Math.floor(USABLE / (ROW_H + ROW_GAP));
  const totalListPages = Math.ceil(allProcessed.length / PER_PAGE);

  for (let page = 0; page < totalListPages; page++) {
    if (page > 0) doc.addPage();

    sf(C.amberLight);
    doc.rect(0, 0, W, 20, "F");
    sd(C.amberBorder);
    doc.setLineWidth(0.6);
    doc.line(0, 20, W, 20);
    doc.setLineWidth(0.3);
    fs(12);
    fn("bold");
    st(C.amber);
    doc.text(
      playerName
        ? `${playerName} — Carreras recomendadas`
        : "Carreras recomendadas",
      M,
      13,
    );
    fs(8);
    fn("normal");
    st(C.slate500);
    doc.text(`${page + 1} / ${totalListPages}`, W - M, 13, { align: "right" });

    const slice = allProcessed.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
    let dy = HEADER;

    slice.forEach((c, idx) => {
      const gi = page * PER_PAGE + idx;
      const isFirst = gi === 0;
      const y = dy;

      if (isFirst) {
        sf(C.amberLight);
        rr(M, y, CW, ROW_H, 5);
        sf(C.white);
        doc.setGState(new doc.GState({ opacity: 0.4 }));
        rr(M + CW * 0.5, y, CW * 0.5, ROW_H, 5);
        doc.setGState(new doc.GState({ opacity: 1 }));
      } else {
        sf(C.white);
        rr(M, y, CW, ROW_H, 5);
      }

      sd(isFirst ? C.amber : C.slate200);
      doc.setLineWidth(isFirst ? 0.7 : 0.35);
      rr(M, y, CW, ROW_H, 5, "D");
      doc.setLineWidth(0.3);

      sf(rankColor(gi));
      doc.rect(M, y + 2, 3, ROW_H - 4, "F");

      fs(9);
      fn("bold");
      st(isFirst ? C.amber : C.slate500);
      doc.text(`${gi + 1}°`, M + 9.5, y + ROW_H / 2 + 1.5, { align: "center" });

      const nameLines = doc.splitTextToSize(c.career, CW - 60);
      fs(isFirst ? 10 : 9.5);
      fn("bold");
      st(C.slate800);
      const nameY = nameLines.length > 1 ? y + 7 : y + ROW_H / 2 + 1.5;
      doc.text(nameLines, M + 17, nameY);

      if (nameLines.length === 1) {
        const starsStr =
          "★".repeat(Math.round(c.finalScore / 20)) +
          "☆".repeat(5 - Math.round(c.finalScore / 20));
        fs(7);
        fn("normal");
        st(C.amberBorder);
        // doc.text(starsStr, M + 17, y + ROW_H / 2 + 7);
      }

      if (c.npc?.link) {
        const lnkW = 44;
        const lnkH = 7;
        const lnkX = W - M - lnkW - 20;
        const lnkY = y + (ROW_H - lnkH) / 2;
        sf(C.slate800);
        rr(lnkX, lnkY, lnkW, lnkH, 3.5);
        fs(6);
        fn("bold");
        st(C.white);
        doc.text("Ver en Univalle", lnkX + lnkW / 2, lnkY + lnkH / 2 + 1, {
          align: "center",
        });
        doc.link(lnkX, lnkY, lnkW, lnkH, { url: c.npc.link });
      }

      fs(isFirst ? 13 : 11);
      fn("bold");
      st(C.amber);
      doc.text(`${c.finalScore.toFixed(0)}`, W - M - 3, y + ROW_H / 2 + 1.5, {
        align: "right",
      });

      dy += ROW_H + ROW_GAP;
    });

    sep(H - 12, C.amberBorder, 0.4);
    fs(7);
    fn("normal");
    st(C.slate500);
    doc.text(
      "Universidad del Valle  ·  Sede Palmira  ·  Orientación Vocacional",
      M,
      H - 6,
    );
    doc.text(`${page + 1} / ${totalListPages}`, W - M, H - 6, {
      align: "right",
    });
  }

  const fileName = playerName
    ? `reporte_vocacional_${playerName.replace(/\s+/g, "_").toLowerCase()}.pdf`
    : "reporte_vocacional.pdf";
  doc.save(fileName);
}

function CareerDetailsModal({ career, onClose }) {
  const { npc, finalScore, career: careerName } = career;
  const closeBtnRef = useRef(null);
  const announcerRef = useRef(null);

  useEffect(() => {
    const fId = setTimeout(() => closeBtnRef.current?.focus(), 100);
    const aId = setTimeout(() => {
      if (!announcerRef.current) return;
      announcerRef.current.textContent = "";
      requestAnimationFrame(() => {
        if (announcerRef.current)
          announcerRef.current.textContent =
            `Detalles de ${careerName}. Puntaje: ${finalScore.toFixed(0)} puntos. ` +
            `Tu guía: ${npc?.name}, ${npc?.career}. Presiona Escape o Cerrar para salir.`;
      });
    }, 300);
    return () => {
      clearTimeout(fId);
      clearTimeout(aId);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const modal = document.getElementById("career-modal-content");
    if (!modal) return;
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const trap = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={announcerRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
      <div
        id="career-modal-content"
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          className="modal-close"
          onClick={onClose}
          aria-label="Cerrar diálogo de detalles de carrera"
        >
          ✕
        </button>
        <h2 id="modal-title">{careerName}</h2>
        <div
          className="modal-score-badge"
          aria-label={`Puntaje: ${finalScore.toFixed(0)} puntos`}
        >
          Puntaje: {finalScore.toFixed(0)} pts
        </div>
        <div className="modal-section">
    
        </div>
        <div className="modal-links">
          {npc?.link && (
            <a
              href={npc.link}
              target="_blank"
              rel="noopener noreferrer"
              className="link-univalle"
              aria-label={`Ver información sobre ${careerName} en la Universidad del Valle, abre en nueva ventana`}
            >
              Ver más información
            </a>
          )}
        </div>

        <div className="modal-actions">
          <button
            className="btn-explore"
            onClick={onClose}
            aria-label="Seguir explorando otras carreras"
          >
            Seguir explorando
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CareerSummary() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAllCareers, setShowAllCareers] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const titleRef = useRef(null);
  const announcerRef = useRef(null);

  const announce = (msg) => {
    if (!announcerRef.current) return;
    announcerRef.current.textContent = "";
    requestAnimationFrame(() => {
      if (announcerRef.current) announcerRef.current.textContent = msg;
    });
  };

  useEffect(() => {
    const id = setTimeout(() => titleRef.current?.focus(), 100);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const userId = localStorage.getItem("userId");
  const playerName = localStorage.getItem("playerName");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let results = [];
        if (userId) {
          results = await getUserFeedback(userId);
        } else {
          const saved = localStorage.getItem("careerTestResults");
          if (saved) results = JSON.parse(saved);
        }
        setData(results);
        setTimeout(
          () =>
            announce(
              `Resultados cargados. ${results.length} carreras encontradas.`,
            ),
          400,
        );
      } catch (err) {
        console.error(err);
        announce(
          "Error al cargar los resultados. Por favor, intenta de nuevo.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const allProcessed = useMemo(
    () =>
      data
        .map((item) => {
          const npc = NPCS[item.career];
          return {
            ...item,
            career: npc?.career_name || item.career,
            finalScore: item.score * 5,
            npc,
          };
        })
        .sort((a, b) => b.finalScore - a.finalScore),
    [data],
  );

  const displayed = showAllCareers ? allProcessed : allProcessed.slice(0, 5);
  const best = allProcessed[0];

  const handleDownloadReport = useCallback(async () => {
    if (downloading || !allProcessed.length) return;
    setDownloading(true);
    announce("Generando tu reporte PDF, un momento...");
    try {
      await new Promise((r) => setTimeout(r, 50));
      generatePDFReport(allProcessed, playerName);
      announce("Reporte descargado exitosamente.");
    } catch (err) {
      console.error("Error generando el PDF:", err);
      announce("Ocurrió un error al generar el reporte. Intenta de nuevo.");
    } finally {
      setDownloading(false);
    }
  }, [allProcessed, playerName, downloading]);

  const handleShowAllCareers = () => {
    setShowAllCareers(true);
    announce(`Mostrando todas las ${allProcessed.length} carreras.`);
  };
  const handleShowTopFive = () => {
    setShowAllCareers(false);
    announce("Mostrando las 5 mejores carreras.");
  };
  const handleOpenDetails = (career) => {
    setSelectedCareer(career);
    setShowDetails(true);
  };
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedCareer(null);
    announce("Diálogo cerrado.");
  };

  if (loading)
    return (
      <div
        className="overlay"
        role="status"
        aria-live="polite"
        aria-label="Cargando resultados"
      >
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner" aria-hidden="true" />
            <p>Cargando tus resultados...</p>
          </div>
        </div>
      </div>
    );

  if (!allProcessed.length)
    return (
      <div className="overlay" role="alert" aria-live="assertive">
        <div className="container">
          <h1 className="title">Sin Resultados</h1>
          <p>Completa el test primero para ver tus carreras recomendadas.</p>
          <button
            className="btn-explore"
            onClick={() => (window.location.href = "/test")}
            aria-label="Ir al test vocacional"
          >
            Ir al test vocacional
          </button>
        </div>
      </div>
    );

  return (
    <div className="overlay">
      <div
        ref={announcerRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div className="container" role="main" aria-labelledby="summary-title">
        <h1
          id="summary-title"
          className="title"
          ref={titleRef}
          tabIndex={-1}
          aria-label={
            playerName
              ? `${playerName}, tu Top 5 de carreras`
              : "Tu Top 5 de carreras"
          }
        >
          {playerName ? `${playerName}, tu Top 5` : "Tu Top 5"}
        </h1>

        <button
          className="btn-download-report"
          onClick={handleDownloadReport}
          disabled={downloading}
          aria-label={
            downloading
              ? "Generando reporte PDF, por favor espera"
              : "Descargar reporte completo en PDF"
          }
          aria-busy={downloading}
        >
          {downloading ? (
            <>
              <span className="btn-spinner" aria-hidden="true" /> Generando
              PDF...
            </>
          ) : (
            <>Descargar Reporte</>
          )}
        </button>

        <section className="featured-career" aria-labelledby="featured-title">
          <div className="featured-badge" aria-hidden="true">
            TU MEJOR OPCIÓN
          </div>
          <h2 id="featured-title" className="featured-title">
            {best.career}
          </h2>
          <div
            className="featured-score"
            aria-label={`Puntaje: ${best.finalScore.toFixed(0)} puntos`}
          >
            <span className="score-number" aria-hidden="true">
              {best.finalScore.toFixed(0)}
            </span>
            <span className="score-label" aria-hidden="true">
              puntos
            </span>
          </div>
          <p className="sr-only">
            Esta es la carrera que mejor se alinea con tu perfil.
          </p>
          <button
            className="btn-details"
            onClick={() => handleOpenDetails(best)}
            aria-label={`Ver más detalles sobre ${best.career}, puntaje ${best.finalScore.toFixed(0)} puntos`}
          >
            Ver más
          </button>
        </section>

        <div className="content">
          <section className="section" aria-labelledby="careers-list-title">
            <h2 id="careers-list-title">
              {showAllCareers ? "Todas las carreras" : "Top 5 carreras"}
            </h2>
            <div
              className="list"
              role="list"
              aria-label={
                showAllCareers ? "Lista completa de carreras" : "Top 5 carreras"
              }
            >
              {displayed.map((c, i) => {
                const medal =
                  !showAllCareers && i === 0
                    ? "Primer lugar. "
                    : !showAllCareers && i === 1
                      ? "Segundo lugar. "
                      : !showAllCareers && i === 2
                        ? "Tercer lugar. "
                        : "";
                return (
                  <div
                    key={c.career}
                    className={`row ${i === 0 && !showAllCareers ? "first-place" : ""}`}
                    onClick={() => handleOpenDetails(c)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleOpenDetails(c);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${medal}${c.career}. Puntaje: ${c.finalScore.toFixed(0)} puntos. ${Math.round(c.finalScore / 20)} estrellas. Presiona Enter para ver detalles.`}
                  >
                    <div className="rank" aria-hidden="true">
                      {!showAllCareers && i === 0
                        ? "🥇"
                        : !showAllCareers && i === 1
                          ? "🥈"
                          : !showAllCareers && i === 2
                            ? "🥉"
                            : `${i + 1}°`}
                    </div>
                    <div className="careerName" aria-hidden="true">
                      {c.career}
                    </div>
                    <div className="score" aria-hidden="true">
                      {c.finalScore.toFixed(0)}
                    </div>
                  </div>
                );
              })}
            </div>

            {!showAllCareers && allProcessed.length > 5 && (
              <button
                className="btn-show-all"
                onClick={handleShowAllCareers}
                aria-label={`Ver todas las ${allProcessed.length} carreras evaluadas`}
              >
                Ver todas ({allProcessed.length})
              </button>
            )}
            {showAllCareers && (
              <button
                className="btn-show-all btn-back"
                onClick={handleShowTopFive}
                aria-label="Volver al Top 5 de carreras"
              >
                Volver al Top 5
              </button>
            )}
          </section>

          <section
            className="recommendation"
            aria-labelledby="recommendation-title"
          >
            <h2 id="recommendation-title">Recomendación</h2>
            <p>
              {playerName ? `${playerName}, ` : ""}explora{" "}
              <strong>{best.career}</strong>, la carrera que mejor se alinea
              contigo.
            </p>
            {allProcessed[1] && (
              <p className="alternative">
                Alternativa: <strong>{allProcessed[1].career}</strong>
              </p>
            )}
          </section>
        </div>
      </div>

      {showDetails && selectedCareer && (
        <CareerDetailsModal
          career={selectedCareer}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}
