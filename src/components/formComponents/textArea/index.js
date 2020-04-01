import "./styles.scss";
import React from "react";

const TextArea = ({ placeHolder, onChange, value, label, rows, required=false}) => {
  return (
    <div className="input-field">
      <textarea
        className={
          required ? "input-field__input input-field__input--required" : "input-field__input"
        }
        id={placeHolder}
        type="text"
        placeholder={placeHolder}
        autoComplete="new-password"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        required={required}
      />
      <label htmlFor={placeHolder} className="input-field__label">
        {label}
      </label>
    </div>
  );
};

export default TextArea;