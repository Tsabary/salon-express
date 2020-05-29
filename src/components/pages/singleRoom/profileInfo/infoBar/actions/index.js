import "./styles.scss";
import React, { useState, useContext } from "react";
import { connect } from "react-redux";

import { ReactSVG } from "react-svg";
import { CopyToClipboard } from "react-copy-to-clipboard";

import firebase from "../../../../../../firebase";

import { AuthContext } from "../../../../../../providers/Auth";

import { joinAsMember, leaveAsMember } from "../../../../../../actions/rooms";
import { titleToUrl } from "../../../../../../utils/strings";
import { FloorContext } from "../../../../../../providers/Floor";

const InfoBarActions = ({
  profile,
  setRoom,
  isOwner,
  setIsCalendarVisible,
  setIsInfoVisible,
  setIsProfileEdited,
  joinAsMember,
  leaveAsMember,
}) => {
  const { globalFloorRoom } = useContext(FloorContext);
  const { currentUserProfile } = useContext(AuthContext);

  const [isCalendarHover, setIsCalendarHover] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isInfoHover, setIsInfoHover] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isEditHover, setIsEditHover] = useState(false);

  const [shareButton, setShareButton] = useState("Invite friends +");

  const shareButtonTimer = () => {
    setTimeout(() => {
      setShareButton("Invite friends +");
    }, 3000);
  };

  return (
    <div className="info-bar-actions">
      <CopyToClipboard
        text={`https://salon.express/${profile.username}`}
        onCopy={() => {
          shareButtonTimer();
          setShareButton("Share URL copied!");
          firebase.analytics().logEvent("profile_share_link_copied");
        }}
      >
        <div className="small-button">{shareButton}</div>
      </CopyToClipboard>

      <div className="max-max-max">
        <div
          className={
            isCalendarHover || isCalendarOpen
              ? "info-bar-actions__action info-bar-actions__action--active"
              : "info-bar-actions__action"
          }
          onMouseEnter={() => setIsCalendarHover(true)}
          onMouseLeave={() => setIsCalendarHover(false)}
          onClick={() => {
            setIsCalendarVisible((v) => {
              return !v;
            });
            setIsCalendarOpen(!isCalendarOpen);
          }}
        >
          <ReactSVG
            src={
              isCalendarHover || isCalendarOpen
                ? "../svgs/calendar_white.svg"
                : "../svgs/calendar.svg"
            }
            wrapper="div"
            beforeInjection={(svg) => {
              svg.classList.add("svg-icon--normal");
            }}
          />
        </div>

        <div
          className={
            isInfoHover || isInfoOpen
              ? "info-bar-actions__action info-bar-actions__action--active"
              : "info-bar-actions__action"
          }
          onMouseEnter={() => setIsInfoHover(true)}
          onMouseLeave={() => setIsInfoHover(false)}
          onClick={() => {
            setIsInfoVisible((v) => {
              return !v;
            });
            setIsInfoOpen(!isInfoOpen);
          }}
        >
          <ReactSVG
            src={
              isInfoHover || isInfoOpen
                ? "../svgs/info_white.svg"
                : "../svgs/info.svg"
            }
            wrapper="div"
            beforeInjection={(svg) => {
              svg.classList.add("svg-icon--normal");
            }}
          />
        </div>
        {isOwner ? (
          <div
            className={
              isEditHover
                ? "info-bar-actions__action info-bar-actions__action--active"
                : "info-bar-actions__action"
            }
            onClick={() => setIsProfileEdited(true)}
            onMouseEnter={() => setIsEditHover(true)}
            onMouseLeave={() => setIsEditHover(false)}
          >
            <ReactSVG
              src={isEditHover ? "../svgs/edit_white.svg" : "../svgs/edit.svg"}
              wrapper="div"
              beforeInjection={(svg) => {
                svg.classList.add("svg-icon--normal");
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default connect(null, { joinAsMember, leaveAsMember })(InfoBarActions);
