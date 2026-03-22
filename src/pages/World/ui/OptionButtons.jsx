export default function OptionButtons({ options, selected, onSelect }) {
  return (
    <div className="solutions">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={selected === opt.value ? "active" : ""}
          onClick={() => onSelect(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}