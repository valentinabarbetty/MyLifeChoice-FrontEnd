import React, { useState, useEffect, useRef } from "react";
import "./AuthModal.css";
import RegisterModal from "../RegisterModal/RegisterModal";
import { loginUser, registerUser, googleLogin } from "../../services/userService";
import { auth, provider } from "../../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import Swal from "sweetalert2";

export default function AuthModal({ onClose, onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const titleRef     = useRef(null);
  const announcerRef = useRef(null);

  const showAccessibleAlert = async ({
    icon,
    title,
    text,
    timer = null,
    showConfirmButton = true,
  }) => {
    const previouslyFocused = document.activeElement;

    const swalConfig = {
      icon,
      title,
      text,
      showConfirmButton,
      confirmButtonText: showConfirmButton ? "Aceptar" : undefined,
      confirmButtonColor: "#f59e0b",
      backdrop: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        if (confirmButton) {
          confirmButton.focus();
          confirmButton.setAttribute("aria-label", `Cerrar alerta: ${title}`);
        }

        const popup = Swal.getPopup();
        if (popup) {
          popup.setAttribute("role", "alertdialog");
          popup.setAttribute("aria-modal", "true");
          popup.setAttribute("aria-label", title || text);
        }
      },
      willClose: () => {
        if (previouslyFocused && previouslyFocused.focus) {
          previouslyFocused.focus();
        } else {
          titleRef.current?.focus();
        }
      },
    };

    if (timer) {
      swalConfig.timer = timer;
      swalConfig.timerProgressBar = true;
      swalConfig.showConfirmButton = false;

      setTimeout(() => {
        announce(
          `Alerta: ${text}. Se cerrará automáticamente en ${timer / 1000} segundos.`
        );
      }, 100);
    }

    return Swal.fire(swalConfig);
  };

  useEffect(() => {
    const focusId    = setTimeout(() => titleRef.current?.focus(), 100);
    const announceId = setTimeout(() => {
      announce(
        isRegistering
          ? "Formulario de registro. Completa los campos para crear tu cuenta."
          : "Formulario de inicio de sesión. Ingresa tu correo y contraseña, o usa Google."
      );
    }, 300);
    return () => {
      clearTimeout(focusId);
      clearTimeout(announceId);
    };
  }, [isRegistering]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    const card = document.getElementById("auth-modal-card");
    if (!card) return;

    const getFocusable = () =>
      Array.from(
        card.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.disabled);

    const trap = (e) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
      }
    };

    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [isRegistering]);

  const announce = (msg) => {
    if (!announcerRef.current) return;
    announcerRef.current.textContent = "";
    requestAnimationFrame(() => {
      if (announcerRef.current) announcerRef.current.textContent = msg;
    });
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      announce("Error: por favor completa todos los campos antes de continuar.");
      await showAccessibleAlert({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos",
      });
      return;
    }

    setLoading(true);
    announce("Iniciando sesión, por favor espera.");

    try {
      const response = await loginUser({ email, password });

      localStorage.setItem("logged",      "logged");
      localStorage.setItem("userId",      response.user_id);
      localStorage.setItem("userEmail",   response.email);
      localStorage.setItem("playerName",  response.nickname || response.email.split("@")[0]);
      localStorage.setItem("sessionType", "auth");

      announce(
        `Bienvenido, ${response.nickname || response.email}. Sesión iniciada correctamente.`
      );
      await showAccessibleAlert({
        icon: "success",
        title: "Bienvenido",
        text: response.nickname || response.email,
        timer: 1500,
        showConfirmButton: false,
      });

      onLoginSuccess?.(response);
      window.location.reload();
    } catch (error) {
      //console.error("Error en login:", error);
      announce("Error al iniciar sesión. Credenciales incorrectas o usuario no encontrado.");
      await showAccessibleAlert({
        icon: "error",
        title: "Error al iniciar sesión",
        text: "Credenciales incorrectas o usuario no encontrado",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    announce("Abriendo inicio de sesión con Google.");
    try {
      const result = await signInWithPopup(auth, provider);
      const user   = result.user;
      const data   = await googleLogin(
        user.email,
        user.displayName || user.email.split("@")[0]
      );

      localStorage.setItem("logged",      "logged");
      localStorage.setItem("userId",      data.user_id);
      localStorage.setItem("userEmail",   data.email);
      localStorage.setItem("playerName",  data.nickname);
      localStorage.setItem("sessionType", "google");

      announce(`Bienvenido, ${data.nickname}. Sesión iniciada con Google.`);
      await showAccessibleAlert({
        icon: "success",
        title: "Bienvenido",
        text: data.nickname,
        timer: 1500,
        showConfirmButton: false,
      });

      onLoginSuccess?.(data);
      window.location.reload();
    } catch (error) {
     // console.error("Error en login con Google:", error);
      announce("Error al autenticar con Google. Intenta de nuevo.");
      await showAccessibleAlert({
        icon: "error",
        title: "Error con Google",
        text: "No se pudo autenticar con Google",
      });
    }
  };

  if (isRegistering) {
    return (
      <RegisterModal
        onClose={() => setIsRegistering(false)}
        onSuccess={(data) => {
          onLoginSuccess?.(data);
          setIsRegistering(false);
          onClose();
        }}
        onLoginSuccess={(data) => {
          onLoginSuccess?.(data);
          onClose();
        }}
      />
    );
  }

  return (
    <div
      className="auth-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        ref={announcerRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div className="auth-modal-card" id="auth-modal-card">
        <h2
          id="auth-modal-title"
          className="auth-title"
          ref={titleRef}
          tabIndex={-1}
        >
          Iniciar sesión
        </h2>

        <form
          role="form"
          aria-label="Formulario de inicio de sesión"
          onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
        >
          <label htmlFor="auth-email" className="sr-only">
            Correo electrónico
          </label>
          <input
            id="auth-email"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            autoComplete="email"
            aria-required="true"
            aria-label="Correo electrónico"
          />

          <label htmlFor="auth-password" className="sr-only">
            Contraseña
          </label>
          <input
            id="auth-password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            autoComplete="current-password"
            aria-required="true"
            aria-label="Contraseña"
          />

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
            aria-label={loading ? "Iniciando sesión, por favor espera" : "Iniciar sesión"}
            aria-busy={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="auth-divider" aria-hidden="true">o</div>

        <button
          onClick={handleGoogleLogin}
          className="google-btn"
          aria-label="Iniciar sesión con Google"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt=""
            aria-hidden="true"
            width={20}
            style={{ marginRight: "8px" }}
          />
          Iniciar sesión con Google
        </button>

        <p className="auth-footer">
          ¿No tienes cuenta?{" "}
          <button
            className="auth-link"
            onClick={() => setIsRegistering(true)}
            aria-label="Ir al formulario de registro"
          >
            Regístrate
          </button>
        </p>

        <button
          className="auth-close"
          onClick={onClose}
          aria-label="Cerrar formulario de inicio de sesión"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}