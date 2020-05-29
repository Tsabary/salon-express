import "./styles.scss";
import React, { useState, useEffect } from "react";
import InfoBar from "./infoBar";
import Calendar from "../info/calendar";
import ExtraInfo from "./extraInfo";

const ProfileInfo = ({
  profile,
  setRoom,
  roomIndex,
  floor,
  isOwner,
  setIsProfileEdited,
}) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  return (
    <div className="room-info single-room__info fr">
      <InfoBar
        profile={profile}
        setRoom={setRoom}
        isOwner={isOwner}
        setIsProfileEdited={setIsProfileEdited}
        setIsCalendarVisible={setIsCalendarVisible}
        setIsInfoVisible={setIsInfoVisible}
      />

      {isInfoVisible ? <ExtraInfo profile={profile} /> : null}

      {isCalendarVisible ? (
        <Calendar entityID={`user-${profile.uid}`} isOwner={isOwner} />
      ) : null}
    </div>
  );
};

export default ProfileInfo;
