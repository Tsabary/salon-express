import "./styles.scss";
import React from "react";

import Calendar from "./calendar";
import Donations from "./donations";
import RoomInfo from "./roomInfo";

const Details = ({ room, roomIndex, setRoom, floor, isOwner }) => {
  return (
    <div className="details single-room__details">
      {room ? (
        <Calendar
          room={room}
          roomIndex={roomIndex}
          floor={floor}
          donations={room.accepting_donations}
          isOwner={isOwner}
        />
      ) : null}

      {/** This is the donations tile*/}
      {(room && (room.accepting_donations || room.selling_merch)) || isOwner ? (
        <Donations
          room={room}
          roomIndex={roomIndex}
          floor={floor}
          isOwner={isOwner}
        />
      ) : null}

      {/** This is the room info tile*/}
      {room ? (
        <RoomInfo
          room={room}
          roomIndex={roomIndex}
          floor={floor}
          setRoom={setRoom}
          isOwner={isOwner}
        />
      ) : null}
    </div>
  );
};

export default Details;
