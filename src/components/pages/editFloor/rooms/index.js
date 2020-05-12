import React from "react";

import SingleEditRoom from "./singleEditRoom";

const Rooms = ({rooms, setRooms, setTracks, chosenPlan}) => {
  const renderRooms = (chosenPlan, roomsArray) => {
    return chosenPlan.rooms.map((room, index) => {
      return (
        <SingleEditRoom
          room={room}
          rooms={rooms}
          setRooms={setRooms}
          roomsArray={roomsArray}
          setTracks={setTracks}
          index={index}
          key={index}
        />
      );
    });
  };

  return (
    <div className="edit-floor__section">
      <div className="edit-floor__section-title">Set Rooms</div>
      {rooms && chosenPlan ? (
        <div className="edit-floor__rooms">
          {renderRooms(chosenPlan, rooms)}
        </div>
      ) : null}
    </div>
  );
};

export default Rooms;
