import { useState } from "react";
import "./CareerFeedback.css";
import { saveProgress } from "../../../../services/userService";
import { NPCS } from "../../data/npcsInfo";

import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const QUESTIONS = [
  "¿Qué tanto te gustó esta carrera?",
  "¿Qué tan cómodo/a te sentiste realizando las actividades?",
  "¿Qué tan probable es que elijas esta carrera?",
  "¿Qué tanto te interesa aprender más sobre esto?",
];

const labels = {
  1: "1 de 5",
  2: "2 de 5",
  3: "3 de 5",
  4: "4 de 5",
  5: "5 de 5",
};

export default function CareerFeedback({ career, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [hover, setHover] = useState(-1);

  const handleFinish = async (finalAnswers) => {
    const totalScore = finalAnswers.reduce((acc, val) => acc + val, 0);
    const userId = localStorage.getItem("userId");

    const feedbackData = {
      answers: finalAnswers,
      totalScore,
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

      console.log("✅ Feedback guardado:", feedbackData);
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

          <Typography variant="body2" sx={{ mt: 1 }}>
            {labels[hover !== -1 ? hover : answers[current]] || ""}
          </Typography>

        </Box>

        <p className="feedback-progress">
          {current + 1} / {QUESTIONS.length}
        </p>
      </div>
    </div>
  );
}