import { useMemo, useEffect, useState } from "react";
import { getUserFeedback } from "../../services/userService";
import { NPCS } from "../World/data/npcsInfo";
import "./Summary.css";

const renderStars = (score) => "⭐".repeat(Math.round(score / 20));

function CareerDetailsModal({ career, onClose }) {
  const { npc, finalScore, career: careerName } = career;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>{careerName}</h2>
        <div className="modal-score-badge">Puntaje: {finalScore.toFixed(0)} pts</div>
        <div className="modal-section">
          <h3>🎓 Tu guía</h3>
          <p><strong>{npc?.name}</strong> es {npc?.career}.</p>
        </div>
        {npc?.link && (
          <div className="modal-links">
            <a href={npc.link} target="_blank" rel="noopener noreferrer" className="link-univalle">
              🏛️ Ver en Universidad del Valle
            </a>
          </div>
        )}
        <button className="btn-explore" onClick={onClose}>Seguir explorando</button>
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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => document.body.style.overflow = "auto";
  }, []);

  const userId = localStorage.getItem("userId");
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
      } catch (err) {
        console.error(err);
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
          npc: npc,
        };
      })
      .sort((a, b) => b.finalScore - a.finalScore);
  }, [data]);

  const displayed = showAllCareers ? allProcessed : allProcessed.slice(0, 5);
  const best = allProcessed[0];

  if (loading) return (
    <div className="overlay"><div className="container"><div className="loading-spinner"><div className="spinner"></div><p>Cargando...</p></div></div></div>
  );

  if (!allProcessed.length) return (
    <div className="overlay"><div className="container"><h1 className="title">Sin Resultados</h1><p>Completa el test primero.</p></div></div>
  );

  return (
    <div className="overlay">
      <div className="container">
        <h1 className="title">🎯 {playerName ? `${playerName}, tu Top 5` : "Tu Top 5"}</h1>

        <div className="featured-career">
          <div className="featured-badge">🏆 TU MEJOR OPCIÓN</div>
          <h2 className="featured-title">{best.career}</h2>
          <div className="featured-score">
            <span className="score-number">{best.finalScore.toFixed(0)}</span>
            <span className="score-label">puntos</span>
          </div>
          <button className="btn-details" onClick={() => { setSelectedCareer(best); setShowDetails(true); }}>
            🔍 Ver más
          </button>
        </div>

        <div className="content">
          <div className="section">
            <h2>📊 {showAllCareers ? "Todas" : "Top 5"}</h2>
            <div className="list">
              {displayed.map((c, i) => (
                <div key={c.career} className={`row ${i === 0 && !showAllCareers ? "first-place" : ""}`}
                  onClick={() => { setSelectedCareer(c); setShowDetails(true); }}>
                  <div className="rank">
                    {!showAllCareers && i === 0 ? "🥇" : !showAllCareers && i === 1 ? "🥈" : !showAllCareers && i === 2 ? "🥉" : `${i+1}°`}
                  </div>
                  <div className="careerName">{c.career}<span className="stars">{renderStars(c.finalScore)}</span></div>
                  <div className="score">{c.finalScore.toFixed(0)}</div>
                </div>
              ))}
            </div>
            {!showAllCareers && allProcessed.length > 5 && (
              <button className="btn-show-all" onClick={() => setShowAllCareers(true)}>📋 Ver todas ({allProcessed.length})</button>
            )}
            {showAllCareers && (
              <button className="btn-show-all btn-back" onClick={() => setShowAllCareers(false)}>⬅️ Volver al Top 5</button>
            )}
          </div>
          <div className="recommendation">
            <h2>🚀 Recomendación</h2>
            <p>{playerName ? `${playerName}, ` : ""}explora <strong>{best.career}</strong>, la carrera que mejor se alinea contigo.</p>
            {allProcessed[1] && <p className="alternative">💡 Alternativa: <strong>{allProcessed[1].career}</strong></p>}
          </div>
        </div>
      </div>
      {showDetails && selectedCareer && <CareerDetailsModal career={selectedCareer} onClose={() => setShowDetails(false)} />}
    </div>
  );
}