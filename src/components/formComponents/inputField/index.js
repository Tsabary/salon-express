import "./styles.scss";
import React from "react";

const InputField = ({
  placeHolder,
  onChange,
  value,
  label,
  type,
  className,
  isNumber,
  numbersAndLetters,
  required = false,
  pattern = null,
}) => {
  const handleChange = (string) => {
    switch (true) {
      case isNumber:
        onChange(Number(string.replace(/\D/, "")));
        break;

      case numbersAndLetters:
        onChange(string.replace(/[^a-zA-Z0-9]/, ""));
        break;

      default:
        onChange(string);
    }
  };

  return (
    <div className={className ? `input-field ${className}` :"input-field"}>
      <input
        className={
          required
            ? "input-field__input input-field__input--required"
            : "input-field__input"
        }
        id={placeHolder}
        type={type}
        placeholder={placeHolder}
        value={value || ""}
        onChange={(e) => handleChange(e.target.value)}
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
