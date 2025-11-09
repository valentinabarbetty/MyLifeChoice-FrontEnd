import React, { useState } from "react";
import "./RegisterModal.css";
import { registerUser } from "../../services/userService";
import { GoogleLogin } from "@react-oauth/google";

export default function RegisterModal({ onClose, onLoginSuccess, onNext }) {
  const [nickname, setNickname] = useState(
    localStorage.getItem("playerName") || ""
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleGoogleLogin = (credentialResponse) => {
    console.log("Google token:", credentialResponse.credential);
    alert("Sesión iniciada con Google (simulada)");
    localStorage.setItem("authMethod", "google");
    onLoginSuccess?.({ method: "google" });
    onClose();
  };
  const handleSubmit = async () => {
    if (!nickname.trim() || !email.trim() || !password.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        nickname,
        email,
        password,
        player_type: 1,
        guide: parseInt(localStorage.getItem("selectedGuide")) || 1,
      });

      localStorage.setItem("playerName", response.nickname || nickname);
      localStorage.setItem("userEmail", response.email);
      localStorage.setItem("sessionType", "auth");
      localStorage.setItem("logged", "logged");

      alert(
        `✅ ¡Registro exitoso! Bienvenido/a, ${response.nickname || nickname}.`
      );

      onLoginSuccess?.(response);
      if (onNext) onNext();
      onClose();
    } catch (err) {
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.email?.[0]?.includes("already exists")) {
          alert(
            "⚠️ Este correo ya está registrado. Intenta con otro o inicia sesión."
          );
        } else {
          alert(`❌ Error: ${JSON.stringify(parsed)}`);
        }
      } catch {
        alert("❌ No se pudo crear la cuenta. Verifica tus datos.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-modal-overlay">
      <div className="register-modal-card">
        <h2 className="register-title">Crear cuenta</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />

        <button
          className="register-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creando..." : "Registrarme"}
        </button>
        <div className="auth-divider">o</div>
        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert("Error al iniciar sesión con Google")}
          />
        </div>
        <button className="register-close" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
