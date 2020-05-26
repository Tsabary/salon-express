import "./styles.scss";
import React from "react";

const TextArea = ({
  placeHolder,
  onChange,
  value,
  label,
  rows,
  className,
  required = false,
}) => {
  return (
    <div className={className ? `text-area ${className}` : "text-area"}>
      <textarea
        className={
          required
            ? "text-area__input text-area__input--required"
            : "text-area__input"
        }
        id={placeHolder}
        type="text"
        placeholder={placeHolder}
        autoComplete="new-password"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        required={required}
      />
      <label htmlFor={placeHolder} className="text-area__label">
        {label}
      </label>
    </div>
  );
};

export default TextArea;
