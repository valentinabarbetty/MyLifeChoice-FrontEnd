import { useState } from "react";
import "./CareerFeedback.css";
import { saveProgress } from "../../../../services/userService";
import { NPCS } from "../../data/npcsInfo";

import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";

const QUESTIONS = [
  "¿Qué tanto te gustó esta carrera?",
  "¿Qué tan cómodo/a te sentiste realizando las actividades?",
  "¿Qué tan probable es que elijas esta carrera?",
  "¿Qué tanto te interesa aprender más sobre esto?",
];

export default function CareerFeedback({ career, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [hover, setHover] = useState(-1);

  const handleFinish = async (finalAnswers) => {
    // Calcular el score (promedio de respuestas, escala 1-5)
    const totalScore = finalAnswers.reduce((acc, val) => acc + val, 0);
    const averageScore = totalScore / finalAnswers.length; // Esto da un valor entre 1 y 5
    
    const userId = localStorage.getItem("userId");

    const feedbackData = {
      answers: finalAnswers,
      totalScore: averageScore, // Guardamos el promedio
      career: career,
      timestamp: new Date().toISOString()
    };

    try {
      // 1️⃣ Si está logueado, guardar en backend
      if (userId) {
        const npcData = NPCS[career];

        await saveProgress({
          user_id: userId,
          career_id: npcData.id,
          state: "done",
          progress: 100,
          feedback: JSON.stringify(feedbackData),
        });
        console.log("✅ Feedback guardado en backend:", feedbackData);
      }

      // 2️⃣ SIEMPRE guardar en localStorage (para usuarios logueados y no logueados)
      const existingResults = localStorage.getItem("careerTestResults");
      let allResults = existingResults ? JSON.parse(existingResults) : [];
      
      // Buscar si ya existe un resultado para esta carrera
      const existingIndex = allResults.findIndex(r => r.career === career);
      
      const newResult = {
        career: career,
        score: averageScore // El score que usa tu Summary (multiplicado por 5 después)
      };
      
      if (existingIndex !== -1) {
        // Actualizar resultado existente
        allResults[existingIndex] = newResult;
      } else {
        // Agregar nuevo resultado
        allResults.push(newResult);
      }
      
      // Guardar en localStorage
      localStorage.setItem("careerTestResults", JSON.stringify(allResults));
      console.log("✅ Feedback guardado en localStorage:", allResults);
      
    } catch (error) {
      console.error("❌ Error guardando:", error);
    }

    onFinish?.();
  };

  const handleSelect = (value) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);

    if (current + 1 < QUESTIONS.length) {
      setTimeout(() => setCurrent(current + 1), 300);
    } else {
      handleFinish(newAnswers);
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-box">
        <p className="feedback-question">{QUESTIONS[current]}</p>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rating
            name="career-rating"
            value={answers[current] || 0}
            precision={1}
            onChange={(event, newValue) => {
              if (newValue) handleSelect(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
            size="large"
          />
        </Box>

        <p className="feedback-progress">
          {current + 1} / {QUESTIONS.length}
        </p>
      </div>
    </div>
  );
}