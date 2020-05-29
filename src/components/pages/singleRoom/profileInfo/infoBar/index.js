import "./styles.scss";
import React, { useContext, useState } from "react";

import InfoBarActions from "./actions";
import Social from "../../../../otherComponents/social";

const InfoBar = ({
  profile,
  setRoom,
  isOwner,
  setIsProfileEdited,
  setIsInfoVisible,
  setIsCalendarVisible,
}) => {
  return profile ? (
    <div className="floating-info">
      <div className="floating-info__main section__container">
        <div className="max-fr">
          <img
            className="floating-info__image"
            src={profile.avatar || "../../imgs/placeholder.jpg"}
            alt="Room"
          />
          <div>
            <div className="floating-info__name">{profile.name}</div>
            <Social data={profile} classname="tiny-margin-top"/>
          </div>
        </div>
        <InfoBarActions
          profile={profile}
          setRoom={setRoom}
          isOwner={isOwner}
          setIsCalendarVisible={setIsCalendarVisible}
          setIsInfoVisible={setIsInfoVisible}
          setIsProfileEdited={setIsProfileEdited}
        />
      </div>
    </div>
  ) : null;
};

export default InfoBar;
