import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Landing.css";
import vid from "/assets/gameplay.mp4";
import logo from "/assets/logo.PNG";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <video className="landing-video" src={vid} autoPlay muted loop playsInline />
      <div className="overlay"></div>

      <motion.img
        src={logo}
        alt="My Life Choice Logo"
        className="landing-logo"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      <motion.div
        className="landing-buttons"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <button className="btn-primary" onClick={() => navigate("/intro")}>
          Empezar aventura
        </button>
      </motion.div>
    </div>
  );
}
