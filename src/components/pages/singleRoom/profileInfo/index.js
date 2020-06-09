import "./styles.scss";
import React, { useState, useEffect } from "react";
import InfoBar from "./infoBar";
import Calendar from "../info/calendar";
import ExtraInfo from "./extraInfo";
import Embed from "./embed";

const ProfileInfo = ({
  profile,
  setRoom,
  isOwner,
  setIsProfileEdited,
  setIsSettingsEdited,
}) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isEmbedVisible, setIsEmbedVisible] = useState(false);

  return (
    <div className="room-info single-room__info fr">
      <InfoBar
        profile={profile}
        setRoom={setRoom}
        isOwner={isOwner}
        setIsProfileEdited={setIsProfileEdited}
        setIsSettingsEdited={setIsSettingsEdited}
        setIsCalendarVisible={setIsCalendarVisible}
        setIsInfoVisible={setIsInfoVisible}
        setIsEmbedVisible={setIsEmbedVisible}
      />

      {isEmbedVisible ? <Embed profile={profile} /> : null}

      {isInfoVisible ? <ExtraInfo profile={profile} /> : null}

      {isCalendarVisible ? (
        <Calendar
          entityID={`user-${profile.uid}`}
          isOwner={isOwner}
          isPrivate={false}
        />
      ) : null}
    </div>
  );
};

export default ProfileInfo;
