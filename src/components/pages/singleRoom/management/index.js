import "./styles.scss";
import React from "react";

import Admin from "./admin";
import AudioSettings from "./audioSettings";

const Management = ({
  entityID,
  roomIndex,
  floor,
  currentAudioChannel,
  isOwner,
}) => {

  return (
    <div className="management single-room__management">
      {/** This is the audio settings tile, in case the user is the page's admin*/}
      {isOwner ? (
        <AudioSettings
        entityID={entityID}
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
