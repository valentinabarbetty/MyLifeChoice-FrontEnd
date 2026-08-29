export default function OptionCard({ title, image, subtitle, isActive, onClick, index, total }) {
  return (
    <button
      className={`card selectable ${isActive ? "active" : ""}`}
      onClick={onClick}
      // CORREGIDO: antes esto era aria-pressed={isActive}, el patrón de
      // "botón interruptor" — VoiceOver anunciaba "activado/desactivado"
      // o "presionado/no presionado", que suena a encender/apagar algo,
      // no a elegir una opción entre varias. role="radio" + aria-checked
      // es el patrón correcto para "una opción de un conjunto": VoiceOver
      // dice "seleccionada/no seleccionada", y con aria-posinset/
      // aria-setsize además dice en qué posición está (ej. "2 de 3").
      role="radio"
      aria-checked={isActive}
      aria-posinset={index}
      aria-setsize={total}
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