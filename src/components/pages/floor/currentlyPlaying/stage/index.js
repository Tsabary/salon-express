import "./styles.scss";
import React, { useContext } from "react";
import { FloorContext } from "../../../../../providers/Floor";

const Stage = ({ room }) => {
  const { setGlobalFloorRoom } = useContext(FloorContext);

  return (
    <div className="stage" onClick={() => setGlobalFloorRoom(room)}>
      <div className="stage__title">{room.name}</div>

      {room.active_channel && room.active_channel.title ? (
        <div className="stage__active">{room.active_channel.title}</div>
      ) : null}
    </div>
  );
};
export default Stage;
