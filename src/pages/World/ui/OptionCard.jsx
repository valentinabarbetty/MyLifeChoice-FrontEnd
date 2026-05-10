export default function OptionCard({ title, image, subtitle, isActive, onClick }) {
  return (
    <button
      className={`card selectable ${isActive ? "active" : ""}`}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={subtitle ? `${title}, ${subtitle}` : title}
      type="button"
    >
      <h3 aria-hidden="true">{title}</h3>

      {image && (
        <img src={image} className="card-img" alt="" aria-hidden="true" />
      )}

      {subtitle && (
        <p aria-hidden="true">{subtitle}</p>
      )}
    </button>
  );
}