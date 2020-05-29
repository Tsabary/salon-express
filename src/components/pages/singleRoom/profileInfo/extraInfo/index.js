import "./styles.scss";
import React from "react";
import Admin from "../../management/admin";

const ExtraInfo = ({ profile}) => {
  return (
    <div className="extra-info section__container">
      <div>
        <div className="section__title">Info</div>
        <div>{profile.description}</div>
      </div>
    </div>
  );
};

export default ExtraInfo;
