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
      console.error("Error guardando:", error);
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
        <p
          className="feedback-question"
          id="feedback-question-label"
        >
          {QUESTIONS[current]}
        </p>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Rating
            name="career-rating"
            value={answers[current] || 0}
            precision={1}
            aria-labelledby="feedback-question-label"
            getLabelText={(value) =>
              `${value} ${value === 1 ? "estrella" : "estrellas"}`
            }
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