import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import history from "../../../history";
import { FloorContext } from "../../../providers/Floor";
import { AuthContext } from "../../../providers/Auth";

import Updates from "./updates";
import Faq from "./faq";
import Backstage from "./backstage";

const BottomHelpers = () => {
  const myHistory = useHistory(history);
  const { globalFloor } = useContext(FloorContext);
  const { currentUserProfile } = useContext(AuthContext);

  return (
    <div className="bottom-helpers">
      <div style={{ position: "relative" }}>
        <div className="bottom-helpers__chats">
          <Faq />
          <Updates />
          {currentUserProfile &&
          globalFloor &&
          globalFloor.admins_ID.includes(currentUserProfile.uid) ? (
            <Backstage />
          ) : null}
        </div>
      </div>
      <div>
        {/* {!globalFloor ? (
          <div
            className="bottom-helpers__notice clickable"
            onClick={() => myHistory.push("/floor/inqlusiv")}
          >
            <div className="bottom-helpers__notice--title">INQLUSIV</div>
            <div className="bottom-helpers__notice--body extra-tiny-margin-top">
              Looking for INQLUSIV Festival? Click here.
            </div>
          </div>
        ) : null} */}
      </div>
    </div>
  );
};

export default BottomHelpers;
