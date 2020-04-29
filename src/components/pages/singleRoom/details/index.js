import "./styles.scss";
import React, { useContext } from "react";
import { AuthContext } from "../../../../providers/Auth";

import Calendar from "./calendar";
import Donations from "./donations";
import RoomInfo from "./roomInfo";

const Details = ({ room, setRoom }) => {
  const { currentUserProfile } = useContext(AuthContext);


    
  return (
    <div className="details single-room__details">
      {room ? (
        <Calendar room={room} donations={room.accepting_donations} />
      ) : null}

      {/** This is the donations tile*/}
      {(room && room.accepting_donations) ||
      (currentUserProfile &&
        room &&
        currentUserProfile.uid === room.user_ID) ? (
        <Donations room={room} />
      ) : null}

      {/** This is the room info tile*/}
      {room ? (
        <RoomInfo
          room={room}
          setRoom={setRoom}
        />
      ) : null}
    </div>
  );
};

export default Details;
