import React, { useMemo, useEffect, useState, useRef, useCallback } from "react";
import { jsPDF } from "jspdf";
import { getUserFeedback } from "../../services/userService";
import { NPCS } from "../World/data/npcsInfo";
import "./Summary.css";

const renderStars = (score) => "⭐".repeat(Math.round(score / 20));

function generatePDFReport(allProcessed, playerName) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();   // 210
  const H = doc.internal.pageSize.getHeight();  // 297
  const margin = 18;
  const contentW = W - margin * 2;

  const colors = {
    primary:    [79,  70,  229],   
    secondary:  [124, 58,  237],  
    accent:     [245, 158, 11],   
    dark:       [17,  24,  39],   
    mid:        [75,  85,  99],   
    light:      [243, 244, 246],   
    white:      [255, 255, 255],
    gold:       [251, 191, 36],
    silver:     [209, 213, 219],
    bronze:     [180, 120, 60],
  };

  const setFill   = (c) => doc.setFillColor(...c);
  const setDraw   = (c) => doc.setDrawColor(...c);
  const setTxt    = (c) => doc.setTextColor(...c);
  const setFont   = (name, style = "normal") => doc.setFont(name, style);
  const setSize   = (s) => doc.setFontSize(s);

  const roundRect = (x, y, w, h, r, fill = true, stroke = false) => {
    doc.roundedRect(x, y, w, h, r, r, (fill && stroke) ? "FD" : fill ? "F" : "D");
  };

  const centerText = (text, y, size, color, fontStyle = "bold") => {
    setSize(size);
    setFont("helvetica", fontStyle);
    setTxt(color);
    doc.text(text, W / 2, y, { align: "center" });
  };

  const medalLabel = (i) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return `${i + 1}°`;
  };

  const progressBar = (x, y, w, h, pct, barColor) => {
    setFill(colors.light);
    roundRect(x, y, w, h, h / 2);
    if (pct > 0) {
      setFill(barColor);
      roundRect(x, y, Math.max(w * pct, h), h, h / 2);
    }
  };

  const separator = (y, color = colors.light) => {
    setDraw(color);
    doc.setLineWidth(0.3);
    doc.line(margin, y, W - margin, y);
  };


  setFill(colors.primary);
  doc.rect(0, 0, W, H / 2, "F");
  setFill(colors.secondary);
  doc.rect(0, H / 2, W, H / 2, "F");

  doc.setGState(new doc.GState({ opacity: 0.08 }));
  setFill(colors.white);
  doc.circle(W - 30, 30, 50, "F");
  doc.circle(15, H - 20, 60, "F");
  doc.circle(W / 2, H / 2, 80, "F");
  doc.setGState(new doc.GState({ opacity: 1 }));

  setFill(colors.white);
  doc.setGState(new doc.GState({ opacity: 0.15 }));
  roundRect(W / 2 - 22, 38, 44, 44, 10);
  doc.setGState(new doc.GState({ opacity: 1 }));

  centerText("🎯", 68, 28, colors.white, "normal");  

  centerText("REPORTE VOCACIONAL", 88, 22, colors.white);
  centerText("Tu perfil de carrera", 97, 11, [199, 210, 254], "normal");

  if (playerName) {
    setFill([255, 255, 255]);
    doc.setGState(new doc.GState({ opacity: 0.18 }));
    roundRect(margin + 20, 108, contentW - 40, 18, 4);
    doc.setGState(new doc.GState({ opacity: 1 }));
    centerText(playerName.toUpperCase(), 120, 14, colors.gold);
  }

  const best = allProcessed[0];
  setFill(colors.gold);
  roundRect(margin + 10, 135, contentW - 20, 36, 6);

  setTxt(colors.dark);
  setFont("helvetica", "bold");
  setSize(8);
  doc.text("🏆  MEJOR OPCIÓN", margin + 18, 145);

  setSize(15);
  setFont("helvetica", "bold");
  setTxt(colors.dark);
  const bestName = best.career.length > 38 ? best.career.slice(0, 36) + "…" : best.career;
  doc.text(bestName, margin + 18, 157);

  setSize(10);
  setFont("helvetica", "normal");
  setTxt(colors.mid);
  doc.text(`Puntaje: ${best.finalScore.toFixed(0)} pts`, W - margin - 10, 157, { align: "right" });

  const now = new Date();
  const dateStr = now.toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
  centerText(dateStr, 185, 9, [199, 210, 254], "normal");

  setFill([255, 255, 255]);
  doc.setGState(new doc.GState({ opacity: 0.12 }));
  doc.rect(0, H - 28, W, 28, "F");
  doc.setGState(new doc.GState({ opacity: 1 }));
  centerText("Universidad del Valle  ·  Orientación Vocacional", H - 16, 9, [199, 210, 254], "normal");
  centerText("Este reporte es orientativo. Te invitamos a explorar cada opción.", H - 9, 7.5, [199, 210, 254], "normal");


  doc.addPage();

  setFill(colors.primary);
  doc.rect(0, 0, W, 22, "F");
  setTxt(colors.white);
  setFont("helvetica", "bold");
  setSize(11);
  doc.text("TOP 5 CARRERAS RECOMENDADAS", margin, 14);
  setFont("helvetica", "normal");
  setSize(8);
  doc.text(`${allProcessed.length} carreras evaluadas`, W - margin, 14, { align: "right" });

  const top5 = allProcessed.slice(0, 5);
  const maxScore = top5[0]?.finalScore || 100;

  let yy = 32;
  const cardH = 36;
  const gap = 6;

  const rankBg = [colors.gold, colors.silver, colors.bronze, colors.light, colors.light];
  const rankTxt = [colors.dark, colors.dark, colors.white, colors.mid, colors.mid];

  top5.forEach((c, i) => {
    const y = yy + i * (cardH + gap);

    doc.setGState(new doc.GState({ opacity: 0.06 }));
    setFill(colors.dark);
    roundRect(margin + 1, y + 1, contentW, cardH, 5);
    doc.setGState(new doc.GState({ opacity: 1 }));

    setFill(i === 0 ? [254, 252, 232] : colors.white);
    roundRect(margin, y, contentW, cardH, 5);

    setFill(i < 3 ? rankBg[i] : colors.light);
    roundRect(margin, y, 8, cardH, 3);

    setTxt(i < 3 ? rankTxt[i] : colors.mid);
    setFont("helvetica", "bold");
    setSize(i < 3 ? 10 : 9);
    doc.text(medalLabel(i), margin + 4, y + cardH / 2 + 1, { align: "center" });


    setTxt(colors.dark);
    setFont("helvetica", "bold");
    setSize(11);
    const name = c.career.length > 32 ? c.career.slice(0, 30) + "…" : c.career;
    doc.text(name, margin + 13, y + 13);

    setTxt(colors.mid);
    setFont("helvetica", "normal");
    setSize(8);
    if (c.npc?.name) {
      doc.text(`Guía: ${c.npc.name}  ·  ${c.npc.career || ""}`, margin + 13, y + 21);
    }

    const pct = c.finalScore / maxScore;
    progressBar(margin + 13, y + 26, contentW - 65, 4, pct,
      i === 0 ? colors.gold : i === 1 ? colors.silver : i === 2 ? colors.bronze : colors.primary);

    setTxt(i === 0 ? colors.accent : colors.primary);
    setFont("helvetica", "bold");
    setSize(13);
    doc.text(`${c.finalScore.toFixed(0)}`, W - margin - 4, y + 15, { align: "right" });
    setTxt(colors.mid);
    setFont("helvetica", "normal");
    setSize(7);
    doc.text("pts", W - margin - 4, y + 22, { align: "right" });
  });

  yy = 32 + top5.length * (cardH + gap) + 12;
  setFill([238, 242, 255]);
  roundRect(margin, yy, contentW, 28, 5);
  setTxt(colors.primary);
  setFont("helvetica", "bold");
  setSize(9);
  doc.text("💡  Recomendación", margin + 6, yy + 9);
  setTxt(colors.dark);
  setFont("helvetica", "normal");
  setSize(8.5);
  const recText = playerName
    ? `${playerName}, explora ${best.career}, la opción que mejor se alinea con tu perfil.`
    : `Explora ${best.career}, la opción que mejor se alinea con tu perfil.`;
  const recLines = doc.splitTextToSize(recText, contentW - 12);
  doc.text(recLines, margin + 6, yy + 18);

  if (allProcessed[1]) {
    yy += 32;
    setTxt(colors.mid);
    setFont("helvetica", "italic");
    setSize(8);
    doc.text(`Alternativa destacada: ${allProcessed[1].career}  (${allProcessed[1].finalScore.toFixed(0)} pts)`, margin, yy);
  }

  const chunkSize = 4; 
  for (let page = 0; page < Math.ceil(allProcessed.length / chunkSize); page++) {
    doc.addPage();

    setFill(colors.secondary);
    doc.rect(0, 0, W, 22, "F");
    setTxt(colors.white);
    setFont("helvetica", "bold");
    setSize(11);
    doc.text("DETALLE DE CARRERAS", margin, 14);
    setFont("helvetica", "normal");
    setSize(8);
    doc.text(`Página ${page + 3} de ${Math.ceil(allProcessed.length / chunkSize) + 2}`, W - margin, 14, { align: "right" });

    const slice = allProcessed.slice(page * chunkSize, (page + 1) * chunkSize);
    let cy = 30;

    slice.forEach((c, idx) => {
      const globalIdx = page * chunkSize + idx;
      const blockH = 52;

      doc.setGState(new doc.GState({ opacity: 0.05 }));
      setFill(colors.dark);
      roundRect(margin + 1, cy + 1, contentW, blockH, 5);
      doc.setGState(new doc.GState({ opacity: 1 }));

      setFill(globalIdx === 0 ? [254, 252, 232] : colors.white);
      roundRect(margin, cy, contentW, blockH, 5);

      const topColor = globalIdx === 0 ? colors.gold
                     : globalIdx === 1 ? colors.silver
                     : globalIdx === 2 ? colors.bronze
                     : colors.primary;
      setFill(topColor);
      roundRect(margin, cy, contentW, 10, 5);
      setFill(topColor);
      doc.rect(margin, cy + 5, contentW, 5, "F");

      setTxt(globalIdx < 3 ? colors.dark : colors.white);
      setFont("helvetica", "bold");
      setSize(9);
      doc.text(`${medalLabel(globalIdx)}  ${c.career}`, margin + 4, cy + 7);

      setFill(colors.white);
      doc.setGState(new doc.GState({ opacity: 0.25 }));
      roundRect(W - margin - 30, cy + 1, 28, 8, 3);
      doc.setGState(new doc.GState({ opacity: 1 }));
      setTxt(globalIdx < 3 ? colors.dark : colors.white);
      setFont("helvetica", "bold");
      setSize(8);
      doc.text(`${c.finalScore.toFixed(0)} pts`, W - margin - 16, cy + 7, { align: "center" });

      const bodyY = cy + 14;

      setTxt(colors.primary);
      setFont("helvetica", "bold");
      setSize(7.5);
      doc.text("Tu guía:", margin + 4, bodyY);

      setTxt(colors.dark);
      setFont("helvetica", "normal");
      setSize(8);
      const guideName = c.npc?.name || "—";
      const guideCareer = c.npc?.career || "";
      doc.text(`${guideName}${guideCareer ? "  ·  " + guideCareer : ""}`, margin + 22, bodyY);

      if (c.npc?.link) {
        setTxt(colors.primary);
        setFont("helvetica", "normal");
        setSize(7);
        doc.text("Ver en Univalle:", margin + 4, bodyY + 8);
        doc.setTextColor(99, 102, 241);
        doc.textWithLink(c.npc.link, margin + 30, bodyY + 8, { url: c.npc.link });
        setTxt(colors.dark);
      } else {
        setTxt(colors.mid);
        setFont("helvetica", "italic");
        setSize(7);
        doc.text("Sin enlace disponible", margin + 4, bodyY + 8);
      }

      progressBar(margin + 4, bodyY + 14, contentW - 40, 5, c.finalScore / 100, topColor);
      setTxt(colors.mid);
      setFont("helvetica", "normal");
      setSize(6.5);
      doc.text(`${c.finalScore.toFixed(1)} / 100`, W - margin - 4, bodyY + 18, { align: "right" });

      const stars = "★".repeat(Math.round(c.finalScore / 20)) + "☆".repeat(5 - Math.round(c.finalScore / 20));
      setTxt(colors.gold);
      setFont("helvetica", "normal");
      setSize(10);
      doc.text(stars, margin + 4, bodyY + 28);

      cy += blockH + 8;
    });
  }

  const totalPages = doc.getNumberOfPages();
  for (let p = 2; p <= totalPages; p++) {
    doc.setPage(p);
    separator(H - 12, colors.light);
    setTxt(colors.mid);
    setFont("helvetica", "normal");
    setSize(7);
    doc.text("Universidad del Valle  ·  Orientación Vocacional", margin, H - 6);
    doc.text(`${p} / ${totalPages}`, W - margin, H - 6, { align: "right" });
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
    const focusId = setTimeout(() => closeBtnRef.current?.focus(), 100);
    const announceId = setTimeout(() => {
      if (!announcerRef.current) return;
      announcerRef.current.textContent = "";
      requestAnimationFrame(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent =
            `Detalles de ${careerName}. ` +
            `Puntaje: ${finalScore.toFixed(0)} puntos. ` +
            `Tu guía: ${npc?.name}, ${npc?.career}. ` +
            `Presiona Escape o el botón Cerrar para salir.`;
        }
      });
    }, 300);
    return () => { clearTimeout(focusId); clearTimeout(announceId); };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const modal = document.getElementById("career-modal-content");
    if (!modal) return;
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    const trap = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
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
          <h3>Tu guía</h3>
          <p id="modal-description">
            <strong>{npc?.name}</strong> es {npc?.career}.
          </p>
        </div>
        {npc?.link && (
          <div className="modal-links">
            <a
              href={npc.link}
              target="_blank"
              rel="noopener noreferrer"
              className="link-univalle"
              aria-label={`Ver información sobre ${careerName} en la Universidad del Valle, abre en nueva ventana`}
            >
              Ver en Universidad del Valle
            </a>
          </div>
        )}
        <button
          className="btn-explore"
          onClick={onClose}
          aria-label="Seguir explorando otras carreras"
        >
          Seguir explorando
        </button>
      </div>
    </div>
  );
}


export default function CareerSummary() {
  const [data, setData]                     = useState([]);
  const [loading, setLoading]               = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showDetails, setShowDetails]       = useState(false);
  const [showAllCareers, setShowAllCareers] = useState(false);
  const [downloading, setDownloading]       = useState(false);  // ← NUEVO

  const titleRef     = useRef(null);
  const announcerRef = useRef(null);

  const announce = (msg) => {
    if (!announcerRef.current) return;
    announcerRef.current.textContent = "";
    requestAnimationFrame(() => {
      if (announcerRef.current) announcerRef.current.textContent = msg;
    });
  };

  useEffect(() => {
    const focusId = setTimeout(() => titleRef.current?.focus(), 100);
    return () => clearTimeout(focusId);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const userId     = localStorage.getItem("userId");
  const playerName = localStorage.getItem("playerName");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let results = [];
        if (userId) {
          const res = await getUserFeedback(userId);
          results = res;
        } else {
          const saved = localStorage.getItem("careerTestResults");
          if (saved) results = JSON.parse(saved);
        }
        setData(results);
        setTimeout(() => {
          announce(`Resultados cargados. Se encontraron ${results.length} carreras con tu perfil.`);
        }, 400);
      } catch (err) {
        console.error(err);
        announce("Error al cargar los resultados. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const allProcessed = useMemo(() => {
    return data
      .map((item) => {
        const npc = NPCS[item.career];
        return {
          ...item,
          career: npc?.career_name || item.career,
          finalScore: item.score * 5,
          npc,
        };
      })
      .sort((a, b) => b.finalScore - a.finalScore);
  }, [data]);

  const displayed = showAllCareers ? allProcessed : allProcessed.slice(0, 5);
  const best      = allProcessed[0];

  const handleDownloadReport = useCallback(async () => {
    if (downloading || !allProcessed.length) return;
    setDownloading(true);
    announce("Generando tu reporte PDF, un momento...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 50));
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
    announce("Diálogo cerrado. De vuelta en el resumen de carreras.");
  };

  if (loading) return (
    <div className="overlay" role="status" aria-live="polite" aria-label="Cargando resultados">
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner" aria-hidden="true" />
          <p>Cargando tus resultados...</p>
        </div>
      </div>
    </div>
  );

  if (!allProcessed.length) return (
    <div className="overlay" role="alert" aria-live="assertive">
      <div className="container">
        <h1 className="title">Sin Resultados</h1>
        <p>Completa el test primero para ver tus carreras recomendadas.</p>
        <button
          className="btn-explore"
          onClick={() => window.location.href = "/test"}
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
          aria-label={playerName ? `${playerName}, tu Top 5 de carreras` : "Tu Top 5 de carreras"}
        >
          🎯 {playerName ? `${playerName}, tu Top 5` : "Tu Top 5"}
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
              <span className="btn-spinner" aria-hidden="true" />
              Generando PDF...
            </>
          ) : (
            <>
              📄 Descargar Reporte
            </>
          )}
        </button>

        <section className="featured-career" aria-labelledby="featured-title">
          <div className="featured-badge" aria-hidden="true">
            🏆 TU MEJOR OPCIÓN
          </div>
          <h2 id="featured-title" className="featured-title">
            {best.career}
          </h2>
          <div
            className="featured-score"
            aria-label={`Puntaje: ${best.finalScore.toFixed(0)} puntos`}
          >
            <span className="score-number" aria-hidden="true">{best.finalScore.toFixed(0)}</span>
            <span className="score-label" aria-hidden="true">puntos</span>
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
              aria-label={showAllCareers ? "Lista completa de carreras" : "Top 5 carreras"}
            >
              {displayed.map((c, i) => {
                const medal =
                  !showAllCareers && i === 0 ? "Primer lugar. " :
                  !showAllCareers && i === 1 ? "Segundo lugar. " :
                  !showAllCareers && i === 2 ? "Tercer lugar. " : "";

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
                      {!showAllCareers && i === 0 ? "🥇"
                        : !showAllCareers && i === 1 ? "🥈"
                        : !showAllCareers && i === 2 ? "🥉"
                        : `${i + 1}°`}
                    </div>
                    <div className="careerName" aria-hidden="true">
                      {c.career}
                      <span className="stars">{renderStars(c.finalScore)}</span>
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

          <section className="recommendation" aria-labelledby="recommendation-title">
            <h2 id="recommendation-title">Recomendación</h2>
            <p>
              {playerName ? `${playerName}, ` : ""}explora{" "}
              <strong>{best.career}</strong>, la carrera que mejor se alinea contigo.
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