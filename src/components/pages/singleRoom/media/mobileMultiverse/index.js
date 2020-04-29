import "./styles.scss";
import React, { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import { titleToKey } from "../../../../../utils/strings";
import { listenToMultiverse, detachListener } from "../../../../../actions";

import Portal from "./portal";
import { connect } from "react-redux";

const MobileMultiverse = ({ room, listenToMultiverse, detachListener }) => {
  const [open, setOpen] = useState(false);

  // This is the multivers - a documents with info of all our portals
  const [multiverse, setMultiverse] = useState(null);

  // This is the same multiverse just as an array of objects rather as an object
  const [multiverseArray, setMultiverseArray] = useState(null);

  useEffect(() => {
    listenToMultiverse(room.id, setMultiverse, setMultiverseArray);

    return function cleanup() {
      detachListener();
    };
  }, [detachListener, room]);

  // Render the portals to the page
  const renderPortals = (multiverse) => {
    return multiverse.map((portal) => {
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

export default connect(null, { listenToMultiverse, detachListener })(MobileMultiverse);
