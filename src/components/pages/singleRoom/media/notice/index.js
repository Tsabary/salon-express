import "./styles.scss";
import React from "react";

const Notice = ({ text }) => {
  return (
    <div className="notice media__no-mobile section__container">{text}</div>
  );
};

export default Notice;
