import "./styles.scss";
import React, { useState, useEffect } from "react";

const ToggleButton = ({ id, toggleOn, toggleOff, isChecked }) => {
  const [checked, setChecked] = useState(isChecked);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    isFirstLoad ? setIsFirstLoad(false) : checked ? toggleOn() : toggleOff();
  }, [checked]);

  return (
    <div className="toggle-button">
      <input
        className="toggle-button__checkbox"
        type="checkbox"
        defaultChecked={isChecked}
        id={id}
        onChange={() => setChecked(!checked)}
        // readOnly
      />
      <label className="toggle-button__label" htmlFor={id}>
        <div className="toggle-button__component" id="component" />
      </label>
    </div>
  );
};

export default ToggleButton;
