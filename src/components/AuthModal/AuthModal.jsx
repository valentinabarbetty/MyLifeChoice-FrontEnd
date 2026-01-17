import React, { useState } from "react";
import "./AuthModal.css";
import RegisterModal from "../RegisterModal/RegisterModal";
import { loginUser, registerUser } from "../../services/userService";
import { auth, provider } from "../../firebaseConfig";
import { signInWithPopup } from "firebase/auth";

export default function AuthModal({ onClose, onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      alert(`Bienvenido/a, ${response.nickname || response.email}`);

      localStorage.setItem("logged", "logged");
      localStorage.setItem("userId", response.user_id);
      localStorage.setItem("userEmail", response.email);
      localStorage.setItem("playerName", response.nickname || response.email.split("@")[0]);
      localStorage.setItem("sessionType", "auth");

      onLoginSuccess?.(response);
    } catch (error) {
      console.error("Error en login:", error);
      alert("No se pudo iniciar sesión. Verifica tus datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await registerUser({
        email: user.email,
        nickname: user.displayName || user.email.split("@")[0],
        password: "google_auth",
        player_type: 1
      });

      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("playerName", user.displayName);
      localStorage.setItem("sessionType", "google");
      localStorage.setItem("logged", "logged");
      alert(`Bienvenido/a, ${user.displayName}!`);
    } catch (error) {
      console.error("Error en login con Google:", error);
      alert("Error al autenticar con Google.");
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

            <button className="auth-btn" onClick={handleLogin} disabled={loading}>
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
              <span className="auth-link" onClick={() => setIsRegistering(true)}>
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
