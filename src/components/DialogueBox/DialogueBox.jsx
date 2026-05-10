import "./DialogueBox.css";
import arrowIcon from "/assets/ui/arrow-next.png";
import { useEffect, useRef, useId } from "react";

export default function DialogueBox({ text, speaker = "", onNext, showNext = true, children }) {
  const textRef = useRef();
  const speakerId = useId();
  const textId = useId();

  useEffect(() => {
    if (textRef.current) {
      textRef.current.focus();
    }
  }, [text]);

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && showNext && onNext) {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <div
      className="dlg-wrapper"
      role="dialog"
      aria-modal="true"
      aria-labelledby={speaker ? speakerId : textId}
      aria-describedby={speaker ? textId : undefined}
      onKeyDown={handleKeyDown}
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
         
          style={{ outline: "none" }}
        >
          {text}
        </p>

        {children && (
          <div className="dialogue-children" role="group" aria-label="Opciones">
            {children}
          </div>
        )}

        {showNext && (
          <button
            className="dlg-arrow-btn"
            onClick={onNext}
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