import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";

import { FloorContext } from "../../../providers/Floor";

import { fetchFloor } from "../../../actions";
import { titleToKey } from "../../../utils/strings";

import Comments from "./comments";
import Media from "./media";
import Management from "./management";
import Details from "./details";
import { AuthContext } from "../../../providers/Auth";

const FloorRoom = ({ match, myFloors, fetchFloor }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { floor, setFloor } = useContext(FloorContext);

  const [isOwner, setIsOwner] = useState(false);

  // This is our room
  const [room, setRoom] = useState(null);
  const [roomIndex, setRoomIndex] = useState(null);

  const [currentAudioChannel, setCurrentAudioChannel] = useState(null);

  useEffect(() => {
    setIsOwner(
      currentUserProfile && floor && currentUserProfile.uid === floor.user_ID
    );
  }, [currentUserProfile, room, floor]);

  // useEffect(() => {
  //   const thisFloor = myFloors.filter(
  //     (floor) => floor.id === match.params.id
  //   )[0];

  //   if (!thisFloor) {
  //     fetchFloor(match.params.id);
  //   } else {
  //     const thisRoom = Object.values(thisFloor.rooms).filter(
  //       (el) => titleToKey(el.name) === match.params.room
  //     )[0];
  //     if (thisRoom) {
  //       setFloor(thisFloor);
  //       setRoom(thisRoom);
  //       for (var i = 0; i < Object.values(thisFloor.rooms).length; i++) {
  //         if (titleToKey(Object.values(thisFloor.rooms)[i].name) === match.params.room) {
  //           setRoomIndex(roomIndex)
  //         }
  //       }
  //     }
  //   }
  // }, [match.params, myFloors]);

  // Our main render
  return (
    <div className="single-room">
      {/** This is the video chat, the embedded streams, the Mixlr and the Multiverse*/}
      <Media
        room={room}
        currentAudioChannel={currentAudioChannel}
        match={match}
        floor={floor}
        isOwner={isOwner}
      />

      <Details room={room} setRoom={setRoom} floor={floor} isOwner={isOwner} />

      <Management
        room={room}
        currentAudioChannel={currentAudioChannel}
        floor={floor}
        isOwner={isOwner}
      />

      {/** This is the comments tile*/}
      {room ? <Comments room={room} match={match} floor={floor} /> : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    myFloors: state.myFloors,
  };
};

export default connect(mapStateToProps, {
  fetchFloor,
})(FloorRoom);
