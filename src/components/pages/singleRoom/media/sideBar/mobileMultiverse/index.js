import "./styles.scss";
import React, { useState } from "react";
import { connect } from "react-redux";

import ScrollToBottom from "react-scroll-to-bottom";

import { titleToKey } from "../../../../../../utils/strings";

import Portal from "./portal";

const MobileMultiverse = ({ entityID, multiverseArray }) => {
  const [open, setOpen] = useState(false);

  // Render the portals to the page
  const renderPortals = (multiverse) => {
    return multiverse.map((portal) => {
      return (
        <Portal
          portal={portal}
          members={portal.members}
          entityID={entityID}
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
          // readOnly
        />
        <label
          className="max-max mobile-multiverse__top mobile-multiverse__title"
          htmlFor="mobileMultiverse"
        >
          Multiverse
        </label>
        <div className="mobile-multiverse__channels">
          {multiverseArray ? renderPortals(multiverseArray) : null}
        </div>
      </div>
    </div>
  );
};

export default connect(null)(MobileMultiverse);
