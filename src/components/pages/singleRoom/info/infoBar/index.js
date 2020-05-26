import "./styles.scss";
import React, { useContext, useState } from "react";
import { ReactSVG } from "react-svg";
import { RoomContext } from "../../../../../providers/Room";

const InfoBar = ({
  room,
  roomIndex,
  floor,
  isOwner,
  setIsRoomEdited,
  setIsInfoVisible,
  setIsCalendarVisible
}) => {
  const { globalRoom } = useContext(RoomContext);

  const [isCalendarHover, setIsCalendarHover] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isInfoHover, setIsInfoHover] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isEditHover, setIsEditHover] = useState(false);

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
      <div className="floating-info__actions max-max-max-max">
        <div className="small-button">Invite friends +</div>

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

export default InfoBar;
