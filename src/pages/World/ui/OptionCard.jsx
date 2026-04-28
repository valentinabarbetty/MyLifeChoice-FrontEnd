export default function OptionCard({
  title,
  image,
  subtitle,
  isActive,
  onClick,
}) {
  return (
    <div
      className={`card selectable ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <h3>{title}</h3>
      
      {image && <img src={image} className="card-img" alt={title} />}
      
      {subtitle && <p>{subtitle}</p>}  {/* ← ELIMINA "&& !image" */}
    </div>
  );
}