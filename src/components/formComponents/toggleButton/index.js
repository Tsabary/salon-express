import "./styles.scss";
import React, { useState, useEffect } from "react";

const ToggleButton = ({ id, toggleOn, toggleOff, isChecked }) => {
  // console.log(id, isChecked);

  const [checked, setChecked] = useState(isChecked);

  // useEffect(() => {
  //   setChecked(isChecked)
  // },[isChecked])

  useEffect(() => {
    checked ? toggleOn() : toggleOff();
    console.log(checked);
  }, [checked]);

  return (
    <div className="toggle-button">
      <input
        className="toggle-button__checkbox"
        type="checkbox"
        defaultChecked={isChecked}
        id={id}
        onChange={() => setChecked(!checked)}
      />
      <label className="toggle-button__label" htmlFor={id}>
        <div className="toggle-button__component" id="component" />
      </label>
    </div>
  );
};

export default ToggleButton;
