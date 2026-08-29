import { useState, useRef, useEffect } from "react";
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

const STAR_VALUES = [1, 2, 3, 4, 5];

export default function CareerFeedback({ career, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [hover, setHover] = useState(-1);
  const [announcement, setAnnouncement] = useState("");
  const [submitting, setSubmitting] = useState(false);


  const fieldsetRef = useRef(null);

  const lastFocusedRef = useRef(-1);

  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      if (lastFocusedRef.current !== current) {
        lastFocusedRef.current = current;
        fieldsetRef.current?.focus();
      }
    }, 150);
    return () => clearTimeout(focusTimeout);
  }, [current]);

  const decorativeBoxRef = useRef(null);
  useEffect(() => {
    const inputs = decorativeBoxRef.current?.querySelectorAll("input");
    inputs?.forEach((el) => el.setAttribute("tabindex", "-1"));
  }, [current]);

  const handleFinish = async (finalAnswers) => {
    setSubmitting(true);
    const totalScore = finalAnswers.reduce((acc, val) => acc + val, 0);
    const averageScore = totalScore / finalAnswers.length;
    const userId = localStorage.getItem("userId");
    const feedbackData = {
      answers: finalAnswers,
      totalScore: averageScore,
      career: career,
      timestamp: new Date().toISOString()
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
      const existingIndex = allResults.findIndex(r => r.career === career);
      const newResult = { career, score: averageScore };
      if (existingIndex !== -1) {
        allResults[existingIndex] = newResult;
      } else {
        allResults.push(newResult);
      }
      localStorage.setItem("careerTestResults", JSON.stringify(allResults));
    } catch (error) {
    }
    setAnnouncement("Evaluación completada. Gracias por tus respuestas.");
    onFinish?.();
  };

  const handleSelect = (value) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);
    setAnnouncement(
      `Puntuación ${value} de 5. Seleccionada. Utilice Tab para ir al botón Continuar.`
    );
  };

  const handleContinue = () => {
    if (answers[current] == null || submitting) return;
    if (current + 1 < QUESTIONS.length) {
      setCurrent(current + 1);
    } else {
      handleFinish(answers);
    }
  };

  const isLast = current + 1 >= QUESTIONS.length;

  return (
    <div className="feedback-container">
      <div className="feedback-box">

        <p className="sr-only" role="status" aria-live="polite">
          {announcement}
        </p>

        <fieldset
          className="feedback-fieldset"
          key={current}
          ref={fieldsetRef}
          tabIndex={-1}
          aria-describedby="feedback-instructions"
        >
          <legend className="feedback-question" id="feedback-question-label">
            {QUESTIONS[current]}
          </legend>

    
          <span id="feedback-instructions" className="sr-only">
            Para seleccionar la cantidad de estrellas, utilice Tab para
            desplazarse entre las opciones. 1 corresponde a poco y 5
            corresponde a mucho.
          </span>

          <Box
            ref={decorativeBoxRef}
            aria-hidden="true"
            sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Rating
              name="career-rating"
              value={answers[current] || 0}
              precision={1}
              max={5}
              onChange={(event, newValue) => {
                if (newValue) handleSelect(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              size="large"
            />
          </Box>
        </fieldset>

  
        <div className="sr-only" role="radiogroup">
          {STAR_VALUES.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={answers[current] === value}
              aria-label={`Puntuación ${value} de 5. Presione Enter o Espacio para seleccionar.`}
              onClick={() => handleSelect(value)}
            />
          ))}
        </div>

        <button
          type="button"
          className="feedback-continue-btn"
          onClick={handleContinue}
          disabled={answers[current] == null || submitting}
        >
          {isLast ? "Finalizar" : "Continuar"}
        </button>

        <p className="feedback-progress" aria-hidden="true">
          {current + 1} / {QUESTIONS.length}
        </p>
      </div>
    </div>
  );
}