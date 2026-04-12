import { useMemo, useEffect, useState } from "react";
import { getUserFeedback } from "../../services/userService";
import "./Summary.css";

export default function CareerSummary() {
  const [data, setData] = useState([]);
  

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const userId = localStorage.getItem("userId");

useEffect(() => {
  const loadData = async () => {
    try {
      if (!userId) {
        console.warn("No hay userId en localStorage");
        return;
      }

      console.log("🔍 Cargando feedback para userId:", userId);
      const res = await getUserFeedback(userId);
      setData(res);
    } catch (err) {
      console.error(err);
    }
  };

  loadData();
}, [userId]);

  const processed = useMemo(() => {
    return data
      .map((c) => {
        const finalScore = c.score * 5;

        return {
          ...c,
          finalScore,
        };
      })
      .sort((a, b) => b.finalScore - a.finalScore);
  }, [data]);

  if (!processed.length) return null;

  const best = processed[0];

  const promedio =
    processed.reduce((acc, c) => acc + c.finalScore, 0) / processed.length;

  return (
    <div className="overlay">
      <div className="container">
        <h1 className="title">🎯 Tu Resultado</h1>

        <div className="content">
          <div className="section">
            <h2>📊 Resumen</h2>
            <div className="grid">
              <div className="cardSoft">
                <p>Carreras</p>
                <strong>{processed.length}</strong>
              </div>
              <div className="cardSoft">
                <p>Promedio</p>
                <strong>{promedio.toFixed(1)}</strong>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>🏆 Ranking</h2>

            <div className="list">
              {processed.map((c, i) => (
                <div key={i} className="row">
                  <div className="rank">{i + 1}</div>

                  <div className="careerName">
                    {c.career}
                    <span className="stars">{renderStars(c.finalScore)}</span>
                  </div>

                  <div className="score">{c.finalScore.toFixed(0)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="recommendation">
            <h2>🚀 Recomendación</h2>
            <p>
              Según tus respuestas, hay algunas carreras que podrían interesarte
              más que otras. Te sugerimos explorar{" "}
              <strong>{best.career}</strong>, ya que fue la que obtuvo mayor
              afinidad.
              {processed[1] && (
                <>
                  {" "}
                  También podrías revisar <strong>{processed[1].career}</strong>
                  .
                </>
              )}{" "}
              Este resultado es una guía inicial para que conozcas mejor estas
              opciones y descubras cuál se ajusta más a ti.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderStars(score) {
  const stars = Math.round(score / 20);
  return "⭐".repeat(stars);
}
