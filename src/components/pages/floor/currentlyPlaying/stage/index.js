import "./styles.scss";
import React, { useContext } from "react";
import { FloorContext } from "../../../../../providers/Floor";

const Stage = ({ room }) => {
  const { globalFloorRoom, setGlobalFloorRoom } = useContext(FloorContext);

  return (
    <div
      className="stage"
      onClick={() => {
        if (globalFloorRoom) {
          setGlobalFloorRoom(null);
          setGlobalFloorRoom(room);

        } else {
          setGlobalFloorRoom(room);
        }
      }}
    >
      <div
        className={
          globalFloorRoom && globalFloorRoom.id === room.id
            ? "stage__title stage__title--active"
            : "stage__title"
        }
      >
        {room.name}
      </div>

      {room.active_channel && room.active_channel.title ? (
        <div className="stage__active">{room.active_channel.title}</div>
      ) : null}
    </div>
  );
};
export default Stage;
