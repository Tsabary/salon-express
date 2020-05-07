import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";

import { FloorContext } from "../../../providers/Floor";

import { titleToKey } from "../../../utils/strings";

import Comments from "./comments";
import Media from "./media";
import Management from "./management";
import Details from "./details";

const FloorRoom = ({ floor, room, isOwner, entityID }) => {
  const {setGlobalFloorRoomIndex} = useContext(FloorContext)
  const [roomIndex, setRoomIndex] = useState(null);

  const [currentAudioChannel, setCurrentAudioChannel] = useState(null);

  useEffect(() => {
    if (!floor || !room) return;

    for (var i = 0; i < Object.values(floor.rooms).length; i++) {
      if (
        titleToKey(Object.values(floor.rooms)[i].name) === titleToKey(room.name)
      ) {
        setRoomIndex(i);
        setGlobalFloorRoomIndex(i)
        setCurrentAudioChannel(floor.rooms[i].active_channel);
      }
    }
  }, [floor, room]);

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

  // Our main render
  return (
    <div className="single-room single-room--floor">
      {/** This is the video chat, the embedded streams, the Mixlr and the Multiverse*/}
      <Media
        room={room}
        roomIndex={roomIndex}
        floor={floor}
        currentAudioChannel={currentAudioChannel}
        entityID={entityID}
        isOwner={isOwner}
      />

      <Details
        room={room}
        roomIndex={roomIndex}
        floor={floor}
        isOwner={isOwner}
      />

      <Management
        room={room}
        roomIndex={roomIndex}
        floor={floor}
        currentAudioChannel={currentAudioChannel}
        isOwner={isOwner}
      />

      {/** This is the comments tile*/}
      {room ? <Comments room={room} entityID={entityID} floor={floor} /> : null}
    </div>
  );
};

export default connect(null)(FloorRoom);
