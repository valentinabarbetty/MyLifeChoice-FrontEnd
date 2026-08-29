// Loader.jsx
import { useEffect, useRef } from "react";
import "./Loader.css";

export default function Loader() {
  const headingRef = useRef(null);
  const mensajeCompleto = "Cargando mundo. Un momento por favor.";

  useEffect(() => {
    const focusId = setTimeout(() => headingRef.current?.focus(), 100);
    return () => clearTimeout(focusId);
  }, []);

  return (
    <div className="loader-screen">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="loader-title"
        role="status"
        aria-live="polite"
        aria-label={mensajeCompleto}
      >
        Cargando mundo…
      </h1>
      <div className="loader-spinner" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
    </div>
  );
}