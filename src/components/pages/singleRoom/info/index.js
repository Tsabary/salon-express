import "./styles.scss";
import React, { useState, useEffect } from "react";
import InfoBar from "./infoBar";
import Calendar from "./calendar";
import ExtraInfo from "./extraInfo";
import { connect } from "react-redux";

// import { changeListedKeyToPrivate } from '../../../../actions/dangorous';

const RoomInfo = ({
  room,
  setRoom,
  roomIndex,
  floor,
  isOwner,
  setIsRoomEdited,
  changeListedKeyToPrivate,
}) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // useEffect(() => {
  //   if (isInfoVisible) {
  //     setIsCalendarVisible(false);
  //   }

  //   if (isCalendarVisible) {
  //     setIsInfoVisible(false);
  //   }
  // }, [isInfoVisible, isCalendarVisible]);

  return (
    <div className="room-info single-room__info fr">
      <InfoBar
        room={room}
        setRoom={setRoom}
        floor={floor}
        isOwner={isOwner}
        setIsRoomEdited={setIsRoomEdited}
        setIsCalendarVisible={setIsCalendarVisible}
        setIsInfoVisible={setIsInfoVisible}
      />

      {isInfoVisible ? (
        <ExtraInfo room={room} isOwner={isOwner} floor={floor} />
      ) : null}

      {isCalendarVisible ? (
        <Calendar
          room={room}
          entityID={room.id}
          roomIndex={roomIndex}
          floor={floor}
          isOwner={isOwner}
          isPrivate={floor ? floor.private : room.private}
        />
      ) : null}
    </div>
  );
};

export default connect(null, {})(RoomInfo);
