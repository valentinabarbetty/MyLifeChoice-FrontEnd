import React, { useState } from "react";
import "./RegisterModal.css";
import { registerUser } from "../../services/userService";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";
export default function RegisterModal({ onClose, onLoginSuccess, onNext }) {
  const [nickname, setNickname] = useState(
    localStorage.getItem("playerName") || ""
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await registerUser({
        email: user.email,
        nickname: user.displayName || user.email.split("@")[0],
        password: "google_auth",
        player_type: 1,
      });

      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("playerName", user.displayName);
      localStorage.setItem("sessionType", "google");
      localStorage.setItem("logged", "logged");
      alert(`Bienvenido/a, ${user.displayName || user.email}!`);

      onLoginSuccess?.({ email: user.email });
      onClose();
    } catch (error) {
      console.error("Error en login con Google:", error);
      alert("Error al autenticar con Google.");
    }
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
        <button onClick={handleGoogleLogin} className="google-btn">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            width={20}
            style={{ marginRight: "8px" }}
          />
          Continuar con Google
        </button>

        <button className="register-close" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
