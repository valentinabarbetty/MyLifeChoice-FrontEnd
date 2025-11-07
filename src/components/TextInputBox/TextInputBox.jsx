import React from "react";
import "./TextInputBox.css";

export default function TextInputBox({
  value,
  onChange,
  onSubmit,
  placeholder = "Escribe aquí...",
  disabled = false,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="text-input-wrapper">
      <input
        type="text"
        className="text-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
    </div>
  );
}
