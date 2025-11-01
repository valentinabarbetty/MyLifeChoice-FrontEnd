import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Auth.css";

export default function Auth() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Elige cómo deseas continuar</h2>

        <div className="auth-buttons">
          <button className="btn-login" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>

          <button className="btn-register" onClick={() => navigate("/register")}>
            Registrarse
          </button>

          <button className="btn-guest" onClick={() => navigate("/world")}>
            Entrar como invitado
          </button>
        </div>
      </motion.div>
    </div>
  );
}
