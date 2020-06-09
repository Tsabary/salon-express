import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";

import { FloorContext } from "../../../providers/Floor";

import { titleToKey } from "../../../utils/strings";

import Comments from "./comments";
import Media from "./media";
import Management from "./management";
import RoomInfo from "./info";
import EditSlider from "./editSlider";
import { RoomContext } from "../../../providers/Room";

const FloorRoom = ({ isOwner, entityID }) => {
  const {
    globalFloor,
    globalFloorRoom,
    setGlobalFloorRoom,
    setGlobalFloorRoomIndex,
  } = useContext(FloorContext);
  const { setGlobalCurrentAudioChannel } = useContext(RoomContext);

  const [roomIndex, setRoomIndex] = useState(null);
  const [isRoomEdited, setIsRoomEdited] = useState(false);

  useEffect(() => {
    if (!globalFloor || !globalFloorRoom) return;

    for (var i = 0; i < Object.values(globalFloor.rooms).length; i++) {
      if (
        Object.values(globalFloor.rooms)[i].name &&
        titleToKey(Object.values(globalFloor.rooms)[i].name) ===
          titleToKey(globalFloorRoom.name)
      ) {
        setRoomIndex(i);
        setGlobalFloorRoomIndex(i);
        setGlobalCurrentAudioChannel(globalFloor.rooms[i].active_channel);
      }
    }
  }, [globalFloor, globalFloorRoom]);

  // Our main render
  return (
    <div className="single-room single-room--insite">
      <RoomInfo
        room={globalFloorRoom}
        roomIndex={roomIndex}
        setRoom={setGlobalFloorRoom}
        floor={globalFloor}
        isOwner={isOwner}
        setIsRoomEdited={setIsRoomEdited}
      />

      <EditSlider
        room={globalFloorRoom}
        roomIndex={roomIndex}
        isRoomEdited={isRoomEdited}
        setIsRoomEdited={setIsRoomEdited}
        floor={globalFloor}
      />

      <Media
        roomIndex={roomIndex}
        floor={globalFloor}
        entityID={entityID}
        isOwner={isOwner}
      />

      <Management
        room={globalFloorRoom}
        roomIndex={roomIndex}
        floor={globalFloor}
        isOwner={isOwner}
      />

      {globalFloorRoom ? <Comments entityID={entityID} isOwner={isOwner}/> : null}
    </div>
  );
};

export default connect(null)(FloorRoom);

// useEffect(() => {
// const thisFloor = myFloors.filter(
//   (floor) => floor.id === match.params.id
// )[0];

// if (!thisFloor) {
//   fetchFloor(match.params.id);
// } else {
// const thisRoom = Object.values(thisFloor.rooms).filter(
//   (el) => titleToKey(el.name) === match.params.room
// )[0];
// if (thisRoom) {
//   setFloor(thisFloor);
//   setRoom(thisRoom);
//   for (var i = 0; i < Object.values(thisFloor.rooms).length; i++) {
//     if (titleToKey(Object.values(thisFloor.rooms)[i].name) === match.params.room) {
//       setRoomIndex(roomIndex)
//     }
//   }
// }
// }
// }, [match.params, myFloors]);
