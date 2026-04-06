
import { useMemo, useEffect } from "react";

const MOCK_DATA = [
  {
    career: "Administración",
    score: 85,
    answers: [4, 5, 4, 5],
  },
  {
    career: "Ingeniería",
    score: 70,
    answers: [3, 4, 3, 4],
  },
  {
    career: "Medicina",
    score: 60,
    answers: [3, 3, 2, 3],
  },
];

export default function CareerSummary() {
    useEffect(() => {
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "auto";
  };
}, []);
  const processed = useMemo(() => {
    return MOCK_DATA.map((c) => {
      const avgAnswers =
        c.answers.reduce((a, b) => a + b, 0) / c.answers.length;

      const finalScore = (c.score * 0.6) + (avgAnswers * 20 * 0.4);

      return {
        ...c,
        finalScore,
      };
    }).sort((a, b) => b.finalScore - a.finalScore);
  }, []);

  const best = processed[0];

  const promedio =
    processed.reduce((acc, c) => acc + c.finalScore, 0) /
    processed.length;

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <h1 style={styles.title}>🎯 Tu Resultado</h1>

        {/* 🔥 SCROLL INTERNO */}
        <div style={styles.content}>

          {/* RESUMEN */}
          <div style={styles.section}>
            <h2>📊 Resumen</h2>
            <div style={styles.grid}>
              <div style={styles.cardSoft}>
                <p>Carreras</p>
                <strong>{processed.length}</strong>
              </div>
              <div style={styles.cardSoft}>
                <p>Promedio</p>
                <strong>{promedio.toFixed(1)}</strong>
              </div>
            </div>
          </div>

          {/* RANKING */}
          <div style={styles.section}>
            <h2>🏆 Ranking</h2>
            <div style={styles.list}>
              {processed.map((c, i) => (
                <div key={i} style={styles.card}>
                  <div>
                    <strong>
                      {i + 1}. {c.career}
                    </strong>
                    <div style={styles.stars}>
                      {renderStars(c.finalScore)}
                    </div>
                  </div>
                  <span style={styles.score}>
                    {c.finalScore.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RECOMENDACIÓN */}
          <div style={styles.recommendation}>
            <h2>🚀 Recomendación</h2>
            <p>
              Te recomendamos <strong>{best.career}</strong> porque mostraste mayor afinidad y desempeño.
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

const styles = {
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "90%",
    background: "#fdf6f0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px", 
  },

  container: {
    width: "100%",
    maxWidth: "800px",
    height: "80vh",
    minHeight: "500px",
    background: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
   // overflow: "hidden",
  },

  title: {
    textAlign: "center",
    padding: "16px",
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    color: "#6b4f4f",
    borderBottom: "1px solid #eee",
  },

  content: {
    flex: 1,
    overflowY: "auto", // 🔥 SCROLL SOLO AQUÍ
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  section: {
    marginBottom: "5px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },

  cardSoft: {
    background: "#fce7f3",
    padding: "10px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "13px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  card: {
    background: "#f9fafb",
    padding: "10px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  stars: {
    marginTop: "4px",
    fontSize: "13px",
  },

  score: {
    fontWeight: "600",
    color: "#7c3aed",
    fontSize: "14px",
  },

  recommendation: {
    marginTop: "10px",
    background: "#ede9fe",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center",
    fontSize: "14px",
  },
};