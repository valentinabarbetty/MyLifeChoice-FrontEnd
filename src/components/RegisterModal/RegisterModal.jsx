import React, { useState } from "react";
import "./RegisterModal.css";
import { registerUser, googleLogin } from "../../services/userService";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";
import Swal from "sweetalert2";
export default function RegisterModal({ onClose, onLoginSuccess, onNext }) {
  const [nickname, setNickname] = useState(
    localStorage.getItem("playerName") || "",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleGoogleLogin = async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
  
        const data = await googleLogin(
          user.email,
          user.displayName || user.email.split("@")[0],
        );
  
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
  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        nickname: nickname || email.split("@")[0],
        email,
        password,
        player_type: 1,
        guide: parseInt(localStorage.getItem("selectedGuide")) || 1,
      });

      localStorage.setItem("playerName", response.nickname || nickname);
      localStorage.setItem("userEmail", response.email);
      localStorage.setItem("sessionType", "auth");
      localStorage.setItem("logged", "logged");

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: `Bienvenido/a, ${response.nickname || nickname}`,
        confirmButtonColor: "#3085d6",
      });
      onLoginSuccess?.(response);
      if (onNext) onNext();
      onClose();
    } catch (err) {
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.email?.[0]?.includes("already exists")) {
          Swal.fire({
            icon: "warning",
            title: "Correo ya registrado",
            text: "Intenta con otro correo o inicia sesión",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: JSON.stringify(parsed),
          });
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo crear la cuenta. Verifica tus datos.",
        });
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
              Iniciar sesión con Google
            </button>

        <button className="register-close" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
