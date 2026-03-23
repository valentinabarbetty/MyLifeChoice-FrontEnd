import React, { useState } from "react";
import "./AuthModal.css";
import RegisterModal from "../RegisterModal/RegisterModal";
import {
  loginUser,
  registerUser,
  googleLogin,
} from "../../services/userService";
import { auth, provider } from "../../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import Swal from "sweetalert2";

export default function AuthModal({ onClose, onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("LOGIN CLICKED");
    if (!email.trim() || !password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos",
      });
      console.log("EMAIL:", email);
      console.log("PASSWORD:", password);
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: response.nickname || response.email,
        timer: 1500,
        showConfirmButton: false,
      });

      localStorage.setItem("logged", "logged");
      localStorage.setItem("userId", response.user_id);
      localStorage.setItem("userEmail", response.email);
      localStorage.setItem(
        "playerName",
        response.nickname || response.email.split("@")[0],
      );
      localStorage.setItem("sessionType", "auth");

      onLoginSuccess?.(response);
    } catch (error) {
      console.error("Error en login:", error);
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: "Credenciales incorrectas o usuario no encontrado",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔥 SOLO LLAMAS AL SERVICE
      const data = await googleLogin(
        user.email,
        user.displayName || user.email.split("@")[0],
      );

      // guardar sesión
      localStorage.setItem("logged", "logged");
      localStorage.setItem("userId", data.user_id);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("playerName", data.nickname);
      localStorage.setItem("sessionType", "google");

      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: data.nickname,
        timer: 1500,
        showConfirmButton: false,
      });
      onLoginSuccess?.(data);
    } catch (error) {
      console.error("Error en login con Google:", error);
      Swal.fire({
        icon: "error",
        title: "Error con Google",
        text: "No se pudo autenticar con Google",
      });
    }
  };
  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-card">
        {isRegistering ? (
          <RegisterModal
            onClose={() => setIsRegistering(false)}
            onSuccess={(data) => {
              onLoginSuccess?.(data);
              setIsRegistering(false);
              onClose();
            }}
          />
        ) : (
          <>
            <h2 className="auth-title">Iniciar sesión</h2>

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />

            <button
              className="auth-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>

            <div className="auth-divider">o</div>

            <button onClick={handleGoogleLogin} className="google-btn">
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                width={20}
                style={{ marginRight: "8px" }}
              />
              Iniciar sesión con Google
            </button>

            <p className="auth-footer">
              ¿No tienes cuenta?{" "}
              <span
                className="auth-link"
                onClick={() => setIsRegistering(true)}
              >
                Regístrate
              </span>
            </p>

            <button className="auth-close" onClick={onClose}>
              Cerrar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
