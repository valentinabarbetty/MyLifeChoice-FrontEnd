import { useState, useEffect, useRef } from "react";
import "./CareerFeedback.css";
import { saveProgress } from "../../../../services/userService";
import { NPCS } from "../../data/npcsInfo";

const QUESTIONS = [
  "¿Qué tanto te gustó esta carrera?",
  "¿Qué tan cómodo/a te sentiste realizando las actividades?",
  "¿Qué tan probable es que elijas esta carrera?",
  "¿Qué tanto te interesa aprender más sobre esto?",
];

export default function CareerFeedback({ career, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  const questionRef = useRef(null);
  const starRefs = useRef({});

  useEffect(() => {
    setSelectedValue(answers[current] || null);
    if (questionRef.current) {
      questionRef.current.focus();
    }
  }, [current, answers]);

  const handleFinish = async (finalAnswers) => {
    const totalScore = finalAnswers.reduce((acc, val) => acc + val, 0);
    const averageScore = totalScore / finalAnswers.length;
    const userId = localStorage.getItem("userId");

    const feedbackData = {
      answers: finalAnswers,
      totalScore: averageScore,
      career,
      timestamp: new Date().toISOString(),
    };

    try {
      if (userId) {
        const npcData = NPCS[career];
        await saveProgress({
          user_id: userId,
          career_id: npcData.id,
          state: "done",
          progress: 100,
          feedback: JSON.stringify(feedbackData),
        });
      }

      const existingResults = localStorage.getItem("careerTestResults");
      let allResults = existingResults ? JSON.parse(existingResults) : [];
      const existingIndex = allResults.findIndex((r) => r.career === career);
      const newResult = { career, score: averageScore };

      if (existingIndex !== -1) {
        allResults[existingIndex] = newResult;
      } else {
        allResults.push(newResult);
      }

      localStorage.setItem("careerTestResults", JSON.stringify(allResults));
    } catch (error) {
      console.error("Error guardando:", error);
    }

    onFinish?.();
  };

  const handleSelectStar = (value) => {
    setSelectedValue(value);

    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);

    const announcer = document.querySelector('[aria-live="polite"]');
    if (announcer) {
      announcer.textContent = `Seleccionaste ${value} ${value === 1 ? "estrella" : "estrellas"}`;
    }

    setTimeout(() => {
      if (current + 1 < QUESTIONS.length) {
        setCurrent(current + 1);
      } else {
        handleFinish([...newAnswers]);
      }
    }, 300);
  };

  const handleKeyDown = (e, starValue) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelectStar(starValue);
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextStar = starValue + 1;
      if (nextStar <= 5 && starRefs.current[nextStar]) {
        starRefs.current[nextStar].focus();
      }
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevStar = starValue - 1;
      if (prevStar >= 1 && starRefs.current[prevStar]) {
        starRefs.current[prevStar].focus();
      }
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-box">
        <p
          ref={questionRef}
          className="feedback-question"
          tabIndex={-1}
          style={{ outline: "none" }}
        >
          {QUESTIONS[current]}
        </p>

        <div
          className="feedback-stars-row"
          role="group"
          aria-label={`Calificación para: ${QUESTIONS[current]}. Selecciona una puntuación del 1 al 5`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              ref={(el) => (starRefs.current[star] = el)}
              onClick={() => handleSelectStar(star)}
              onKeyDown={(e) => handleKeyDown(e, star)}
              className={`feedback-star-btn ${
                (selectedValue || answers[current]) >= star ? "filled" : ""
              } ${selectedValue === star ? "selected" : ""}`}
              aria-label={`${star} ${star === 1 ? "estrella" : "estrellas"} ${
                selectedValue === star ? ", seleccionada" : ""
              }. Presiona Enter o Espacio para seleccionar y continuar`}
              aria-pressed={selectedValue === star}
              tabIndex={0}
            >
              ★
            </button>
          ))}
        </div>

        <p
          className="feedback-progress"
          aria-label={`Pregunta ${current + 1} de ${QUESTIONS.length}. Selecciona una puntuación para continuar`}
          role="status"
        >
          {current + 1} / {QUESTIONS.length}
        </p>

        <div className="sr-only" aria-live="polite">
          {selectedValue === null &&
            "Selecciona una puntuación del 1 al 5 para continuar"}
        </div>
      </div>
    </div>
  );
}
