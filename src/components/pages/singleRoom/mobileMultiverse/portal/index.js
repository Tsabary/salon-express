import "./styles.scss";
import React, { useEffect } from "react";

import { titleToKey } from '../../../../../utils/strings';

const Portal = ({ portal, room }) => {

  return (
    <a className="portal-mobile" target="_blank" href={`https://meet.jit.si/SalExp-${titleToKey(portal.title + room.id)}`}>
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
