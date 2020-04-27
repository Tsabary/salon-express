import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../../../../providers/Auth";

import history from "../../../../history";
import {
  keepRoomListed,
  associateWithRoom,
  fetchStrangerProfile,
} from "../../../../actions";

import ToggleField from "../../../formComponents/toggleField";
import Social from "../../../otherComponents/social";

const Admin = ({
  room,
  keepRoomListed,
  associateWithRoom,
  fetchStrangerProfile,
}) => {
  const myHistory = useHistory(history);

  const { currentUserProfile } = useContext(AuthContext);

  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (room && room.associate) {
      console.log("mine", "fethcing profile");
      fetchStrangerProfile(room.user_username, setAdmin);
    }
  }, [room]);

  return (room && room.associate) ||
    (currentUserProfile && room && currentUserProfile.uid === room.user_ID) ? (
    <div
      className={
        currentUserProfile && room && currentUserProfile.uid === room.user_ID
          ? "single-room__container-admin--owner section__container"
          : "single-room__container-admin--visitor section__container"
      }
    >
      <div className="section__title">Admin</div>

      {currentUserProfile && room && currentUserProfile.uid === room.user_ID ? (
        <>
          <ToggleField
            id="singleRoomListed"
            text="Keep room public"
            toggleOn={() => keepRoomListed(room, true)}
            toggleOff={() => keepRoomListed(room, false)}
            isChecked={room.listed}
          />
          <ToggleField
            id="singleRoomAssociate"
            text="Associate me with this Room"
            toggleOn={() => associateWithRoom(room, true)}
            toggleOff={() => associateWithRoom(room, false)}
            isChecked={room.associate}
          />
        </>
      ) : null}

      {room && room.associate ? (
        <>
          <div
            className="max-max"
            onClick={() => myHistory.push(`/${room.user_username}`)}
          >
            <img className="comment__avatar" src={room.user_avatar} />
            <div className="comment__user-name">{room.user_name}</div>
          </div>

          <div className="admin__social">
            {admin ? <Social data={admin} /> : null}
          </div>
        </>
      ) : null}
    </div>
  ) : null;
};

export default connect(null, {
  keepRoomListed,
  associateWithRoom,
  fetchStrangerProfile,
})(Admin);
