import "./styles.scss";
import React, { useContext, useState } from "react";

import { FloorContext } from "../../../../../providers/Floor";
import InfoBarActions from "./actions";

const InfoBar = ({
  room,
  setRoom,
  roomIndex,
  // floor,
  isOwner,
  setIsRoomEdited,
  setIsInfoVisible,
  setIsCalendarVisible,
}) => {
  const {globalFloor, globalFloorRoom, setGlobalFloorRoom } = useContext(FloorContext);

  return room ? (
    <div
      className={globalFloorRoom ? "floating-info floating-info--floor" : "floating-info"}
    >
      {globalFloor ? (
        <div
          className="section__container clickable"
          onClick={() => setGlobalFloorRoom(null)}
        >
          <div className="centered">🡠</div>
        </div>
      ) : null}

      <div className="floating-info__main section__container">
        <div className="max-max">
          <img
            className="floating-info__image"
            src={
              (globalFloor &&
                globalFloor.rooms &&
                globalFloor.rooms[roomIndex] &&
                globalFloor.rooms[roomIndex].image) ||
              room.image ||
              "../../imgs/placeholder.jpg"
            }
            alt="Room"
          />
          <div>
            <div className="floating-info__name">{room.name}</div>
            {globalFloor ? (
              <div className="floating-info__details">
                <div>{globalFloor.name}</div>·
                <div>{globalFloor.listed ? " Public Floor" : "Private Floor"}</div>
              </div>
            ) : (
              <div className="floating-info__details">
                <div>{room.listed ? " Public Room" : "Private Room"}</div>·
                <div>
                  {room.members && room.members.length > 0
                    ? room.members.length
                    : "0"}{" "}
                  members
                </div>
              </div>
            )}
          </div>
        </div>
        <InfoBarActions
          room={room}
          setRoom={setRoom}
          // floor={globalFloor}
          isOwner={isOwner}
          setIsCalendarVisible={setIsCalendarVisible}
          setIsInfoVisible={setIsInfoVisible}
          setIsRoomEdited={setIsRoomEdited}
        />
      </div>
    </div>
  ) : null;
};

export default InfoBar;
