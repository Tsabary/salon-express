import "./styles.scss";
import React, { useState, useEffect } from "react";

const ToggleButton = ({ id, isChecked }) => {


  return (
    <div className="toggle-button">
      <input
        className="toggle-button__checkbox"
        type="checkbox"
        checked={isChecked}
        // id={id}
        readOnly
      />
      <label className="toggle-button__label" htmlFor={id}>
        <div className="toggle-button__component" id="component" />
      </label>
    </div>
  );
};

export default ToggleButton;
