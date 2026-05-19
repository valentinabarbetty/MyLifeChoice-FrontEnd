import "./DialogueBox.css";
import arrowIcon from "/assets/ui/arrow-next.png";
import { useEffect, useRef, useId } from "react";

export default function DialogueBox({ text, speaker = "", onNext, showNext = true, children }) {
  const textRef = useRef();
  const speakerId = useId();
  const textId = useId();
  const hintId = useId(); 
  useEffect(() => {
    if (textRef.current) {
      textRef.current.focus();
    }
  }, [text]);

  return (
    <div
      className="dlg-wrapper"
      role="dialog"
      aria-modal="true"
      aria-labelledby={speaker ? speakerId : textId}
      aria-describedby={speaker ? textId : undefined}
    >
      {speaker && (
        <div className="dlg-tag">
          <span id={speakerId}>{speaker}</span>
        </div>
      )}

      <div className="dlg-box">
        <p
          id={textId}
          ref={textRef}
          className="dlg-text"
          tabIndex={-1}
          aria-describedby={showNext ? hintId : undefined} 
          style={{ outline: "none" }}
        >
          {text}
        </p>

        {showNext && (
          <span
            id={hintId}
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: 0,
              margin: "-1px",
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            Para ir al siguiente mensaje, usa Tab y luego Enter.
          </span>
        )}

        {children && (
          <div className="dialogue-children" role="group" aria-label="Opciones">
            {children}
          </div>
        )}

        {showNext && (
          <button
            className="dlg-arrow-btn"
            onClick={onNext}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onNext();
              }
            }}
            aria-label="Siguiente mensaje"
            type="button"
          >
            <img
              src={arrowIcon}
              alt=""
              className="dlg-arrow"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </div>
  );
}