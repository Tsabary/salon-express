import "./styles.scss";
import React, { useState } from "react";
import InfoBar from "./infoBar";
import Calendar from "../details/calendar";
import ExtraInfo from "./extraInfo";

const RoomInfo = ({ room, roomIndex, floor, isOwner, setIsRoomEdited }) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  return (
    <div className="room-info single-room__info fr">
      <InfoBar
        room={room}
        isOwner={isOwner}
        setIsRoomEdited={setIsRoomEdited}
        setIsCalendarVisible={setIsCalendarVisible}
        setIsInfoVisible={setIsInfoVisible}
      />

      {isInfoVisible ? <ExtraInfo room={room} isOwner={isOwner}/> : null}

      {isCalendarVisible ? (
        <Calendar
          room={room}
          roomIndex={roomIndex}
          floor={floor}
          isOwner={isOwner}
        />
      ) : null}
    </div>
  );
};

export default RoomInfo;
