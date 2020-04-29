import "./styles.scss";
import React, { useContext } from "react";

import Admin from "./admin";
import AudioSettings from "./audioSettings";
import { AuthContext } from "../../../../providers/Auth";

const Management = ({ room, currentAudioChannel }) => {
  const { currentUserProfile } = useContext(AuthContext);

  return (
    <div className="management single-room__management">
      {/** This is the audio settings tile, in case the user is the page's admin*/}
      {currentUserProfile && room && currentUserProfile.uid === room.user_ID ? (
        <AudioSettings room={room} currentAudioChannel={currentAudioChannel} />
      ) : null}

      {/** This is the admin info/settings tile*/}
      <Admin room={room} />
    </div>
  );
};

export default Management;
