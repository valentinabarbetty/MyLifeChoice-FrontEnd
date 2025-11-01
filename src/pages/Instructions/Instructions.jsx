import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Instructions.css";

export default function Instructions() {
  const navigate = useNavigate();

  return (
    <div className="instructions-container">
      <motion.div
        className="instructions-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>Instrucciones del juego</h1>
        <ul>
          <li>⬆️⬇️⬅️➡️ Usa las <b>flechas</b> o <b>W, A, S, D</b> para moverte.</li>
          <li>🖱️ Mueve el <b>mouse</b> para mirar alrededor.</li>
          <li>👆 Haz <b>clic</b> sobre los objetos para interactuar.</li>
          <li>💬 Tu guía te acompañará durante toda la exploración.</li>
        </ul>

        <motion.button
          className="btn-start"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/intro")}
        >
          Comenzar aventura
        </motion.button>
      </motion.div>
    </div>
  );
}
