import "./styles.scss";
import React from "react";
import { Emoji } from "emoji-mart";

const Portal = ({ portal, currentPortal, setCurrentPortal }) => {
  return (
    <div className="portal" onClick={() => setCurrentPortal(portal)}>
      <div className="portal__title-container">
        {portal.totem ? (
          <div className="multiverse__emoji">
            <Emoji emoji={portal.totem} size={16} />
          </div>
        ) : null}
        <div
          className={
            currentPortal && currentPortal.title === portal.title
              ? "portal__title--current"
              : "portal__title"
          }
        >
          {portal.title}
        </div>
      </div>
      <div className="portal__members">{portal.members.length} members</div>
    </div>
  );
};

export default Portal;
