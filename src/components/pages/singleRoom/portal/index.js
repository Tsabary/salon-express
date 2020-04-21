import "./styles.scss";
import React from "react";

const Portal = ({ portal, currentPortal, setCurrentPortal }) => {
  return (
    <div className="portal">
      <div className={currentPortal && currentPortal.title === portal.title ? "portal__title--current" : "portal__title"} onClick={() => setCurrentPortal(portal)}>
        {portal.title}
      </div>
      <div className="portal__members">{portal.members.length} members</div>
      {/* <div className="portal__enter">Enter</div> */}
    </div>
  );
};

export default Portal;
