import "./styles.scss";
import React from "react";

import AudioSettings from "./audioSettings";

const Management = ({ profile, entityID, roomIndex, floor, isOwner }) => {
  return (
    <div className="management single-room__management">
      {/** This is the audio settings tile, in case the user is the page's admin*/}
      {isOwner || profile.guest_embed ? (
        <AudioSettings
          entityID={entityID}
          roomIndex={roomIndex}
          floor={floor}
        />
      ) : null}
    </div>
  );
};

export default Management;
