import "./styles.scss";
import React from "react";
import HeaderAuth from "./auth";

const MinimalHeader = () => {
  return (
    <div className="minimal-header">
      <div className="minimal-header__logo">S.</div>
      <div />
      <HeaderAuth />
    </div>
  );
};

export default MinimalHeader;
