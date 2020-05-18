import "./styles.scss";
import React from "react";

import { titleToKey } from "../../../../../../../utils/strings";

const Portal = ({ portal, entityID }) => {
  return (
    <a
      className="portal-mobile"
      target="_blank"
      href={`https://meet.jit.si/SalExp-${titleToKey(portal.title + entityID)}`}
      rel="noopener noreferrer"
    >
      <div className="portal-mobile__content">
        <div className="portal-mobile__title">{portal.title}</div>

        <div className="portal-mobile__members">
          {portal.members.length} members
        </div>
      </div>
      <div className="portal-mobile__border" />
    </a>
  );
};

export default Portal;
