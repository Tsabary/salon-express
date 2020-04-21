import React, { useContext } from "react";

import { AuthContext } from "../../../../providers/Auth";

import history from "../../../../history";
import { keepRoomListed, associateWithRoom } from "../../../../actions";

import ToggleField from "../../../formComponents/toggleField";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const Admin = ({ room, keepRoomListed, associateWithRoom }) => {
    const myHistory = useHistory(history);

  const { currentUserProfile } = useContext(AuthContext);

  return (
    <div className="section__container">
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
          <div className="single-room__founder-admin">Founded by:</div>

          <div
            className="max-max"
            onClick={() => myHistory.push(`/${room.user_username}`)}
          >
            <img className="comment__avatar" src={room.user_avatar} />
            <div className="comment__user-name">{room.user_name}</div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default connect(null, { keepRoomListed, associateWithRoom })(Admin);
