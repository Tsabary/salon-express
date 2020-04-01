import "./styles.scss";
import React from "react";

const InputField = ({
  placeHolder,
  onChange,
  value,
  label,
  type,
  isNumber,
  required = false,
  pattern = null
}) => {
  const handleChange = string => {
    isNumber ? onChange(Number(string.replace(/\D/, ""))) : onChange(string);
  };

  return (
    <div className="input-field">
      <input
        className={
          required ? "input-field__input input-field__input--required" : "input-field__input"
        }
        id={placeHolder}
        type={type}
        placeholder={placeHolder}
        // autocomplete="no"
        // autoComplete="no"
        value={value || ""}
        onChange={e => handleChange(e.target.value)}
        // required={required}
        // pattern={pattern}
      />
      {label ? (
        <label htmlFor={placeHolder} className="input-field__label">
          {label}
        </label>
      ) : null}
    </div>
  );
};

export default InputField;
