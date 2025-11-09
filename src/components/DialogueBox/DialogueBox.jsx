import "./DialogueBox.css";
import arrowIcon from "/assets/ui/arrow-next.png";

export default function DialogueBox({ text, speaker = "", onNext, showNext = true }) {
  return (
    <div className="dlg-wrapper">
      {speaker && (
        <div className="dlg-tag">
          <span>{speaker}</span>
        </div>
      )}

      <div className="dlg-box">
        <p className="dlg-text">{text}</p>

        {showNext && (
          <img
            src={arrowIcon}
            alt="Continuar"
            className="dlg-arrow"
            onClick={onNext}
          />
        )}
      </div>
    </div>
  );
}
