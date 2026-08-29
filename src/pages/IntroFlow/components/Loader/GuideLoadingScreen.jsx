import { useEffect, useRef } from "react";
import "./GuideLoadingScreen.css";

export default function GuideLoadingScreen({ guideName }) {
  const headingRef = useRef(null);

  const mensajeCompleto =
    `Guía seleccionado satisfactoriamente: ${guideName}. Preparando a tu guía, un momento por favor.`;

  useEffect(() => {
    const focusId = setTimeout(() => headingRef.current?.focus(), 100);
    return () => clearTimeout(focusId);
  }, [guideName]);

  return (
    <div className="guide-loading-screen">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="guide-loading-title"
        aria-label={mensajeCompleto}
      >
        Preparando a {guideName}…
      </h1>

      <div className="guide-loading-spinner" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}