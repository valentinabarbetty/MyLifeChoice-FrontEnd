import React, { useState, useEffect, useRef } from "react";
import "./RegisterModal.css";
import { registerUser, googleLogin } from "../../services/userService";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";
import Swal from "sweetalert2";

export default function RegisterModal({ onClose, onLoginSuccess, onNext }) {
  const [nickname, setNickname] = useState(
    localStorage.getItem("playerName") || ""
  );
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const titleRef     = useRef(null);
  const announcerRef = useRef(null);

  useEffect(() => {
    const focusId    = setTimeout(() => titleRef.current?.focus(), 100);
    const announceId = setTimeout(() => {
      announce(
        "Ventana para crear una cuenta. Escribe tu correo, presiona Tab para ir a la contraseña, y presiona Enter para enviar cuando termines. También puedes usar el botón para entrar con Google. Para cerrar esta ventana, presiona Escape."
      );
    }, 300);
    return () => {
      clearTimeout(focusId);
      clearTimeout(announceId);
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    const card = document.getElementById("register-modal-card");
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
  }, []);

  const announce = (msg) => {
    if (!announcerRef.current) return;
    announcerRef.current.textContent = "";
    requestAnimationFrame(() => {
      if (announcerRef.current) announcerRef.current.textContent = msg;
    });
  };

  const showAccessibleAlert = async ({
    icon,
    title,
    text,
    timer = null,
    showConfirmButton = true,
    confirmButtonColor = "#f59e0b",
  }) => {
    const previouslyFocused = document.activeElement;

    const swalConfig = {
      icon,
      title,
      text,
      showConfirmButton,
      confirmButtonText: showConfirmButton ? "Aceptar" : undefined,
      confirmButtonColor,
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

  const handleGoogleLogin = async () => {
    announce("Se abrirá una ventana emergente de Google para que inicies sesión con tu cuenta.");
    try {
      const result = await signInWithPopup(auth, provider);
      const user   = result.user;

      const data = await googleLogin(
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
    } catch (error) {
      announce("No se pudo entrar con Google. Vuelve a intentarlo o crea tu cuenta con correo y contraseña en su lugar.");
      await showAccessibleAlert({
        icon: "error",
        title: "Error con Google",
        text: "No se pudo autenticar con Google",
      });
    }
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      announce("Falta información: escribe tu correo y una contraseña antes de continuar. Usa Tab para moverte entre los dos campos.");
      await showAccessibleAlert({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos",
      });
      return;
    }

    setLoading(true);
    announce("Creando tu cuenta, espera un momento por favor.");

    try {
      const response = await registerUser({
        nickname: nickname || email.split("@")[0],
        email,
        password,
        player_type: 1,
        guide: parseInt(localStorage.getItem("selectedGuide")) || 1,
      });

      localStorage.setItem("playerName",  response.nickname || nickname);
      localStorage.setItem("userEmail",   response.email);
      localStorage.setItem("sessionType", "auth");
      localStorage.setItem("logged",      "logged");
      localStorage.setItem("userId",      response.user_id);

      announce(
        `Cuenta creada. Bienvenido o bienvenida, ${response.nickname || nickname}.`
      );
      await showAccessibleAlert({
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
          announce("Ese correo ya tiene una cuenta. Escribe otro correo, o cierra esta ventana con Escape y usa 'Iniciar sesión' en su lugar.");
          await showAccessibleAlert({
            icon: "warning",
            title: "Correo ya registrado",
            text: "Intenta con otro correo o inicia sesión",
          });
        } else {
          announce("No se pudo completar el registro. Revisa el correo y la contraseña, y vuelve a intentarlo con Tab y Enter.");
          await showAccessibleAlert({
            icon: "error",
            title: "Error",
            text: JSON.stringify(parsed),
          });
        }
      } catch {
        announce("No se pudo crear la cuenta. Revisa que el correo y la contraseña sean válidos y vuelve a intentarlo.");
        await showAccessibleAlert({
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
    <div
      className="register-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
      aria-describedby="register-modal-instructions"
    >
      <div
        ref={announcerRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div className="register-modal-card" id="register-modal-card">
        <h2
          id="register-modal-title"
          className="register-title"
          ref={titleRef}
          tabIndex={-1}
        >
          Crear cuenta
        </h2>

        <p id="register-modal-instructions" className="sr-only">
          Escribe tu correo, presiona Tab para ir a la contraseña, y presiona Enter para enviar.
          Presiona Escape en cualquier momento para cerrar esta ventana.
        </p>

        <form
          role="form"
          aria-label="Crea tu cuenta con correo y contraseña"
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        >
          <label htmlFor="register-email" className="sr-only">
            Correo electrónico. Presiona Tab para ir al siguiente campo.
          </label>
          <input
            id="register-email"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="register-input"
            autoComplete="email"
            aria-required="true"
            aria-label="Correo electrónico. Presiona Tab para ir al campo de contraseña."
          />

          <label htmlFor="register-password" className="sr-only">
            Contraseña. Presiona Enter para enviar cuando termines de escribirla.
          </label>
          <input
            id="register-password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
            autoComplete="new-password"
            aria-required="true"
            aria-label="Contraseña. Presiona Enter para enviar cuando termines de escribirla."
          />

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
            aria-label={loading ? "Creando cuenta, por favor espera" : "Registrarme. También puedes presionar Enter desde los campos de arriba."}
            aria-busy={loading}
          >
            {loading ? "Creando..." : "Registrarme"}
          </button>
        </form>

        <div className="auth-divider" aria-hidden="true">o</div>

        <button
          onClick={handleGoogleLogin}
          className="google-btn"
          aria-label="Continuar con Google. Se abrirá una ventana emergente."
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

        <button
          className="register-close"
          onClick={onClose}
          aria-label="Cerrar esta ventana sin crear la cuenta"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}