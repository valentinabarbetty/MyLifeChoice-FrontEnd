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
          confirmButton.setAttribute("aria-label", `Cerrar aviso: ${title}. Presiona Enter o la barra espaciadora.`);
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
          `Aviso: ${text}. Esta ventana se cerrará sola en ${timer / 1000} segundos, no necesitas hacer nada.`
        );
      }, 100);
    }

    return Swal.fire(swalConfig);
  };

  
  useEffect(() => {
    if (isRegistering) return;

    const focusId    = setTimeout(() => titleRef.current?.focus(), 100);
    const announceId = setTimeout(() => {
      announce(
        "Ventana para iniciar sesión. Primero escribe tu correo, luego presiona Tab para ir a la contraseña. Al terminar, presiona Enter en cualquiera de los dos campos para entrar. También puedes usar el botón para entrar con Google. Para cerrar esta ventana, presiona Escape."
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
    if (isRegistering) return;

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
      announce("Falta información: escribe tu correo y tu contraseña antes de continuar. Usa Tab para moverte entre los dos campos.");
      await showAccessibleAlert({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos",
      });
      return;
    }

    setLoading(true);
    announce("Entrando, espera un momento por favor.");

    try {
      const response = await loginUser({ email, password });

      localStorage.setItem("logged",      "logged");
      localStorage.setItem("userId",      response.user_id);
      localStorage.setItem("userEmail",   response.email);
      localStorage.setItem("playerName",  response.nickname || response.email.split("@")[0]);
      localStorage.setItem("sessionType", "auth");

      announce(
        `Bienvenido, ${response.nickname || response.email}. Ya iniciaste sesión correctamente.`
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
      announce("No se pudo iniciar sesión. Revisa que tu correo y contraseña sean correctos y vuelve a intentarlo con Tab y Enter.");
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
    announce("Se abrirá una ventana emergente de Google para que inicies sesión con tu cuenta.");
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

      announce(`Bienvenido, ${data.nickname}. Ya iniciaste sesión con Google.`);
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
      announce("No se pudo entrar con Google. Vuelve a intentarlo o usa tu correo y contraseña en su lugar.");
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
      aria-describedby="auth-modal-instructions"
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

        <p id="auth-modal-instructions" className="sr-only">
          Escribe tu correo, presiona Tab para ir a la contraseña, y presiona Enter para entrar.
          Presiona Escape en cualquier momento para cerrar esta ventana.
        </p>

        <form
          role="form"
          aria-label="Inicia sesión con tu correo y contraseña"
          onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
        >
          <label htmlFor="auth-email" className="sr-only">
            Correo electrónico. Presiona Tab para ir al siguiente campo.
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
            aria-label="Correo electrónico. Presiona Tab para ir al campo de contraseña."
          />

          <label htmlFor="auth-password" className="sr-only">
            Contraseña. Presiona Enter para entrar cuando termines de escribirla.
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
            aria-label="Contraseña. Presiona Enter para entrar cuando termines de escribirla."
          />

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
            aria-label={loading ? "Entrando, por favor espera" : "Iniciar sesión. También puedes presionar Enter desde los campos de arriba."}
            aria-busy={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="auth-divider" aria-hidden="true">o</div>

        <button
          onClick={handleGoogleLogin}
          className="google-btn"
          aria-label="Iniciar sesión con Google. Se abrirá una ventana emergente."
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
            aria-label="Ir a la ventana para crear una cuenta nueva"
          >
            Regístrate
          </button>
        </p>

        <button
          className="auth-close"
          onClick={onClose}
          aria-label="Cerrar esta ventana sin iniciar sesión"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}