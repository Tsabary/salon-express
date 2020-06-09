import "./styles.scss";
import React, { useContext, useState } from "react";
import { connect } from "react-redux";

import { changeProfilePrivacy } from "../../../../../actions/profiles";
import { eventEntityToArray } from "../../../../../actions/dangorous";

import InfoBarActions from "./actions";
import Social from "../../../../otherComponents/social";
import ToggleButton from "../../../../formComponents/toggleButton";

const InfoBar = ({
  profile,
  setRoom,
  isOwner,
  setIsProfileEdited,
  setIsSettingsEdited,
  setIsInfoVisible,
  setIsEmbedVisible,
  setIsCalendarVisible,
  changeProfilePrivacy,
  eventEntityToArray,
}) => {
  const [isPrivate, setIsPrivate] = useState(!!profile.private);
console.log("setIsSettingsEdited", setIsSettingsEdited)
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
            <Social data={profile.social} classname="tiny-margin-top" />

            {isOwner ? (
              <div
                className="max-max tiny-margin-top"
                onClick={() => {
                  setIsPrivate(!isPrivate);
                  changeProfilePrivacy(profile.uid, !isPrivate);
                }}
              >
                <div className="toggle-button__label clickable">
                  Keep this on to require visitors to knock before entering
                </div>

                <ToggleButton isChecked={isPrivate} />
              </div>
            ) : null}
          </div>
        </div>
        <InfoBarActions
          profile={profile}
          setRoom={setRoom}
          isOwner={isOwner}
          setIsCalendarVisible={setIsCalendarVisible}
          setIsInfoVisible={setIsInfoVisible}
          setIsEmbedVisible={setIsEmbedVisible}
          setIsProfileEdited={setIsProfileEdited}
          setIsSettingsEdited={setIsSettingsEdited}
        />
      </div>
    </div>
  ) : null;
};

export default connect(null, { changeProfilePrivacy, eventEntityToArray })(
  InfoBar
);
