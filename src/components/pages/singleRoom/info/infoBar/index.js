import "./styles.scss";
import React, { useContext, useState } from "react";
import { connect } from "react-redux";

import { ReactSVG } from "react-svg";
import { CopyToClipboard } from "react-copy-to-clipboard";

import firebase from '../../../../../firebase';

import { RoomContext } from "../../../../../providers/Room";
import { AuthContext } from "../../../../../providers/Auth";

import { joinAsMember, leaveAsMember } from "../../../../../actions/rooms";
import { titleToUrl } from "../../../../../utils/strings";

const InfoBar = ({
  room,
  setRoom,
  roomIndex,
  floor,
  isOwner,
  setIsRoomEdited,
  setIsInfoVisible,
  setIsCalendarVisible,
  joinAsMember,
  leaveAsMember,
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { globalRoom } = useContext(RoomContext);

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

  return globalRoom ? (
    <div className="floating-info fr-max section__container">
      <div className="max-max">
        <img
          className="floating-info__image"
          src={
            (floor &&
              floor.rooms &&
              floor.rooms[roomIndex] &&
              floor.rooms[roomIndex].image) ||
            globalRoom.image ||
            "../../imgs/placeholder.jpg"
          }
          alt="Room"
        />
        <div>
          <div className="floating-info__name">{globalRoom.name}</div>
          <div className="floating-info__details">
            <div>{globalRoom.listed ? " Public Room" : "Private Room"}</div>·
            <div>
              {globalRoom.members && globalRoom.members.length > 0
                ? globalRoom.members.length
                : "0"}{" "}
              members
            </div>
          </div>
        </div>
      </div>
      <div className="floating-info__actions">
        <CopyToClipboard
          text={`https://salon.express/room/${titleToUrl(room.name)}-${room.id}`}
          onCopy={() => {
            shareButtonTimer();
            setShareButton("Share URL copied!");
            firebase.analytics().logEvent("room_share_link_copied");
          }}
        >
          <div className="small-button">{shareButton}</div>
        </CopyToClipboard>

        {currentUserProfile && room.members.includes(currentUserProfile.uid) ? (
          <div
            className="small-button small-button--disabled"
            onClick={() =>
              leaveAsMember(currentUserProfile, room, () => {
                setRoom({
                  ...room,
                  members: room.members.filter(
                    (fav) => fav !== currentUserProfile.uid
                  ),
                });
              })
            }
          >
            leave Room
          </div>
        ) : (
          <div
            className="small-button"
            onClick={() =>
              joinAsMember(currentUserProfile, room, () => {
                setRoom({
                  ...room,
                  members: room.members
                    ? [...room.members, currentUserProfile.uid]
                    : [currentUserProfile.uid],
                });
              })
            }
          >
            join Room +
          </div>
        )}

        <div
          className={
            isCalendarHover || isCalendarOpen
              ? "floating-info__action floating-info__action--active"
              : "floating-info__action"
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
              ? "floating-info__action floating-info__action--active"
              : "floating-info__action"
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
                ? "floating-info__action floating-info__action--active"
                : "floating-info__action"
            }
            onClick={() => setIsRoomEdited(true)}
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
  ) : null;
};

export default connect(null, { joinAsMember, leaveAsMember })(InfoBar);
