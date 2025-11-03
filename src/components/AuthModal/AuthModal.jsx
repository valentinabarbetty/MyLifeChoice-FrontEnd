import React, { useState } from "react";
import "./AuthModal.css";
import RegisterModal from "../RegisterModal/RegisterModal";
import { GoogleLogin } from "@react-oauth/google";
import { loginUser } from "../../services/userService";

export default function AuthModal({ onClose, onLoginSuccess, onNext, prueba }) {
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
      console.log("Respuesta del login:", response);

      alert(`Bienvenido/a, ${response.nickname || response.email}`);

        
      // Guarda la sesión local
      localStorage.setItem("userEmail", response.email);
      localStorage.setItem(
        "playerName",
        response.nickname || response.email.split("@")[0]
      );
      localStorage.setItem("sessionType", "auth");

      onLoginSuccess?.(response);
     // prueba();
      //onNext();
    } catch (error) {
      console.error("Error en login:", error);

      let msg = "No se pudo iniciar sesión. Verifica tus datos.";
      try {
        const parsed = JSON.parse(error.message);
        msg = parsed.detail || parsed.error || msg;
      } catch {}

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = (credentialResponse) => {
    console.log("Google token:", credentialResponse.credential);
    alert("Sesión iniciada con Google (simulada)");
    localStorage.setItem("authMethod", "google");
    onLoginSuccess?.({ method: "google" });
    onClose();
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

            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => alert("Error al iniciar sesión con Google")}
              />
            </div>

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
