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

const SingleRoom = ({ match, myFloors, fetchFloor }) => {
  const { floor, setFloor } = useContext(FloorContext);

  // This is our room
  const [room, setRoom] = useState(null);

  const [currentAudioChannel, setCurrentAudioChannel] = useState(null);

  useEffect(() => {
    const thisFloor = myFloors.filter(
      (floor) => floor.id === match.params.id
    )[0];

    if (!thisFloor) {
      fetchFloor(match.params.id);
    } else {
      const thisRoom = Object.values(thisFloor.rooms).filter(
        (el) => titleToKey(el.name) === match.params.room
      )[0];
      if (thisRoom) {
        setFloor(thisFloor);
        setRoom(thisRoom);
      }
    }
  }, [match.params, myFloors]);

  // Our main render
  return (
    <div className="single-room">

      {/** This is the video chat, the embedded streams, the Mixlr and the Multiverse*/}
      <Media
        room={room}
        currentAudioChannel={currentAudioChannel}
        match={match}
        floor={floor}
      />

      <Details room={room} setRoom={setRoom} floor={floor} />

      <Management
        room={room}
        currentAudioChannel={currentAudioChannel}
        floor={floor}
      />

      {/** This is the comments tile*/}
      {room ? <Comments room={room} match={match} floor={floor} /> : null}

      {/* {(floor && room && room.accepting_donations) ||
      (currentUserProfile &&
        floor &&
        room &&
        currentUserProfile.uid === floor.user_ID) ? (
        <Donations room={room} />
      ) : (
        printDetails(floor, room, currentUserProfile)
      )} */}

      {/** This is the audio settings tile, in case the user is the page's admin*/}
      {/* {currentUserProfile &&
      floor &&
      room &&
      currentUserProfile.uid === floor.user_ID ? (
        <AudioSettings room={room} currentAudioChannel={currentAudioChannel} />
      ) : null} */}

      {/** This is the room info tile*/}
      {/* {room ? (
        <RoomInfo
          room={room}
          setRoom={setRoom}
          values={values}
          setValues={setValues}
          currentAudioChannel={currentAudioChannel}
        />
      ) : null} */}
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
})(SingleRoom);
