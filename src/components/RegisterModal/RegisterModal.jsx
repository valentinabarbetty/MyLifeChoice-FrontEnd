import React, { useState } from "react";
import "./RegisterModal.css";
import { registerUser } from "../../services/userService";

export default function RegisterModal({ onClose, onLoginSuccess, onNext }) {
  const [nickname, setNickname] = useState(
    localStorage.getItem("playerName") || ""
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nickname.trim() || !email.trim() || !password.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        //nickname,
        email,
        password,
        player_type: 1,
      });

      // ✅ Guardar datos de sesión inmediatamente
      //localStorage.setItem("playerName", response.nickname || nickname);
      localStorage.setItem("userEmail", response.email);
      localStorage.setItem("sessionType", "auth");
      localStorage.setItem("logged", "logged");

      alert(`✅ ¡Registro exitoso! Bienvenido/a, ${response.nickname || nickname}.`);

      // ✅ Notifica a SessionStep que ya está autenticado
      onLoginSuccess?.(response);

      // ✅ Avanza automáticamente al siguiente diálogo si lo necesita
      if (onNext) onNext();

      // ✅ Cierra el modal
      onClose();
    } catch (err) {
      try {
        const parsed = JSON.parse(err.message);

        if (parsed.email?.[0]?.includes("already exists")) {
          alert("⚠️ Este correo ya está registrado. Intenta con otro o inicia sesión.");
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

        <button className="register-close" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
