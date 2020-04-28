import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";
import { UniqueIdContext } from "../../../providers/UniqueId";
import { RoomContext } from "../../../providers/Room";

import { fetchSingleRoom } from "../../../actions";

import AudioSettings from "./audioSettings";
import RoomInfo from "./roomInfo";
import Comments from "./comments";
import Admin from "./admin";
import Donations from "./donations";
import Calendar from "./calendar";
import Media from "./media";

const SingleRoom = ({ match, fetchSingleRoom }) => {
  const {setGlobalCurrentAudioChannel} = useContext(RoomContext)
  const { currentUserProfile } = useContext(AuthContext);
  const { setGlobalRoom } = useContext(RoomContext);

  // This is a fake unique id based on current timestamp. We use it to identify users that aren't logged in, so we can manage the coun of users in each portal
  const { uniqueId } = useContext(UniqueIdContext);

  // This is our room
  const [room, setRoom] = useState(null);

  // We use this state to hold
  const [values, setValues] = useState({});

  const [currentAudioChannel, setCurrentAudioChannel] = useState(null);

  // This happens when the room first loads. We take the id of the room and also the fake uid (return if it's not set yet) and we fetch the rooms data. There's also a callback for creating a new portal called home in case there aren't any portals in this room yet
  useEffect(() => {
    if (!uniqueId) return;
    fetchSingleRoom(
      match.params.id,
      setRoom,
      setGlobalRoom,
      setCurrentAudioChannel,
      setGlobalCurrentAudioChannel
    );
  }, [match.params.id, uniqueId]);

  // This sets the value of the donations field (so that it'll be present in our edit component). Should just move to it's own component
  useEffect(() => {
    if (
      !room ||
      !currentUserProfile ||
      !currentUserProfile.uid ||
      room.user_ID !== currentUserProfile.uid
    )
      return;

    if (room.donations_url)
      setValues((val) => {
        return { ...val, donations_url: room.donations_url };
      });
  }, [currentUserProfile, room]);

  // Our main render
  return (
    <div className="single-room">
      {/* {!cameraPermissionGranted || !microphonePermissionGranted ? <div className="single-room__point-bg"></div>:null} */}

      {/** This is the video chat, the embedded streams, the Mixlr and the Multiverse*/}
      <Media room={room} currentAudioChannel={currentAudioChannel} />

      {room ? (
        <Calendar
          room={room}
          donations={room.accepting_donations}
          currentAudioChannel={currentAudioChannel}
        />
      ) : null}

      {/** This is the donations tile*/}
      {(room && room.accepting_donations) ||
      (currentUserProfile &&
        room &&
        currentUserProfile.uid === room.user_ID) ? (
        <Donations room={room} />
      ) : null}

      {/** This is the audio settings tile, in case the user is the page's admin*/}
      {currentUserProfile && room && currentUserProfile.uid === room.user_ID ? (
        <AudioSettings room={room} currentAudioChannel={currentAudioChannel} />
      ) : null}

      {/** This is the admin info/settings tile*/}
      <Admin room={room} />

      {/** This is the room info tile*/}
      {room ? (
        <RoomInfo
          room={room}
          setRoom={setRoom}
          values={values}
          setValues={setValues}
          currentAudioChannel={currentAudioChannel}
        />
      ) : null}

      {/** This is the comments tile*/}
      {room ? <Comments room={room} match={match} /> : null}
    </div>
  );
};

export default connect(null, {
  fetchSingleRoom,
})(SingleRoom);
