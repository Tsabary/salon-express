import "./styles.scss";
import React, { useState, useEffect } from "react";
import ToggleButton from "../toggleButton";

const ToggleField = ({ id, text, toggleOn, toggleOff, isChecked }) => {
  return (
    <div className="toggle-field">
      <label className="toggle-button__label" htmlFor={id}>
        <div className="toggle-field__text">{text}</div>
      </label>
      <ToggleButton
        id={id}
        isChecked={isChecked}
        toggleOn={toggleOn}
        toggleOff={toggleOff}
      />
    </div>
  );
};

export default ToggleField;
