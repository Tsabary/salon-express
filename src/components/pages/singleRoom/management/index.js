import "./styles.scss";
import React from "react";

import Admin from "./admin";
import AudioSettings from "./audioSettings";

const Management = ({
  room,
  roomIndex,
  floor,
  currentAudioChannel,
  isOwner,
}) => {
  console.log("isOwner managment", isOwner)
  return (
    <div className="management single-room__management">
      {/** This is the audio settings tile, in case the user is the page's admin*/}
      {isOwner ? (
        <AudioSettings
          room={room}
          roomIndex={roomIndex}
          floor={floor}
          currentAudioChannel={currentAudioChannel}
        />
      ) : null}

      {/** This is the admin info/settings tile*/}
      {/* {!floor ? <Admin room={room} isOwner={isOwner} /> : null} */}
    </div>
  );
};

export default Management;
