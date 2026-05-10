import React, { useMemo, useEffect, useState, useRef } from "react";
import { getUserFeedback } from "../../services/userService";
import { NPCS } from "../World/data/npcsInfo";
import "./Summary.css";

const renderStars = (score) => "⭐".repeat(Math.round(score / 20));

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
  const [data, setData]                   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showDetails, setShowDetails]     = useState(false);
  const [showAllCareers, setShowAllCareers] = useState(false);

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

        <section
          className="featured-career"
          aria-labelledby="featured-title"
        >
          
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

          <section
            className="recommendation"
            aria-labelledby="recommendation-title"
          >
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