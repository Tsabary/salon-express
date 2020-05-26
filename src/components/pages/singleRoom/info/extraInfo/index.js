import "./styles.scss";
import React from "react";
import Admin from "../../management/admin";

const ExtraInfo = ({ room, isOwner }) => {
  return (
    <div className="extra-info section__container">
      <div>
        <div className="section__title">Info</div>
        <div>{room.description}</div>
      </div>

      <div>
        <Admin room={room} isOwner={isOwner} />
      </div>
    </div>
  );
};

export default ExtraInfo;
