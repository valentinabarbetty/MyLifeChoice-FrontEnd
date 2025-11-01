import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import "./SplashScreen.css";

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 1000);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="splash-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* ☁️ Nubes desde izquierda */}
          <div
            className="cloud cloud-left"
            style={{ top: "15%", left: "-10%", animationDuration: "18s" }}
          ></div>
          <div
            className="cloud cloud-left"
            style={{ top: "60%", left: "-15%", animationDuration: "22s" }}
          ></div>
          <div
            className="cloud cloud-left"
            style={{ top: "75%", left: "-20%", animationDuration: "25s" }}
          ></div>

          {/* ☁️ Nubes desde derecha */}
          <div
            className="cloud cloud-right"
            style={{ top: "25%", right: "-15%", animationDuration: "20s" }}
          ></div>
          <div
            className="cloud cloud-right"
            style={{ top: "50%", right: "-10%", animationDuration: "28s" }}
          ></div>
          <div
            className="cloud cloud-right"
            style={{ top: "70%", right: "-18%", animationDuration: "26s" }}
          ></div>

          {/* ☁️ Nubes centrales lentas */}
          <div
            className="cloud cloud-center"
            style={{ top: "40%", left: "30%", animationDuration: "30s" }}
          ></div>
          <div
            className="cloud cloud-center"
            style={{ top: "10%", left: "50%", animationDuration: "35s" }}
          ></div>
          <div
            className="cloud cloud-left"
            style={{
                bottom: "0%",
                left: "50%",
                width: "250px",
                height: "100px",
                animationDuration: "20s",
            }}
            ></div>
            <div
            className="cloud cloud-left"
            style={{
                bottom: "10%",
                left: "20%",
                width: "250px",
                height: "100px",
                animationDuration: "20s",
                opacity: 0.6,
            }}
            ></div>
          {/* 🌟 Logo */}
          <motion.img
            src={logo}
            alt="My Life Choice Logo"
            className="splash-logo"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{
              scale: [0.7, 1.1, 1.0],
              opacity: [0, 1, 1],
            }}
            exit={{
              scale: 1.6,
              opacity: 0,
              transition: { duration: 1.2, ease: "easeInOut" },
            }}
            transition={{
              duration: 1.8,
              times: [0, 0.6, 1],
              ease: "easeOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
