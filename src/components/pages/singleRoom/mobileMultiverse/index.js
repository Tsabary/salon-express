import "./styles.scss";
import React, { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import { titleToKey } from "../../../../utils/strings";

import Portal from "./portal";

const MobileMultiverse = ({ multiverseArray, room }) => {
  const [open, setOpen] = useState(false);

  // Render the portals to the page
  const renderPortals = (multiverse) => {
    return multiverse.map((portal) => {
      console.log("mineportal", portal);

      return (
        <Portal
          portal={portal}
          members={portal.members}
          room={room}
          key={titleToKey(portal.title)}
        />
      );
    });
  };

  return (
    <div className="mobile-multiverse">
      <div className="mobile-multiverse__container">
        <input
          className="mobile-multiverse__checkbox"
          type="checkbox"
          id="mobileMultiverse"
          onChange={() => setOpen(!open)}
        />
        <label
          className="max-max mobile-multiverse__top"
          htmlFor="mobileMultiverse"
        >
          <div className="mobile-multiverse__title">Multiverse</div>
        </label>
        <div className="mobile-multiverse__channels">
          {multiverseArray ? renderPortals(multiverseArray) : null}
        </div>
      </div>
    </div>
  );
};

export default MobileMultiverse;
