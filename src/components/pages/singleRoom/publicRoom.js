import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";
import { UniqueIdContext } from "../../../providers/UniqueId";
import { RoomContext } from "../../../providers/Room";

import { fetchSingleRoom } from "../../../actions";

import Comments from "./comments";

import Media from "./media";
import Details from "./details";
import Management from "./management";

const SingleRoom = ({ match, fetchSingleRoom }) => {
  const { setGlobalCurrentAudioChannel } = useContext(RoomContext);
  const { setGlobalRoom } = useContext(RoomContext);

  // This is a fake unique id based on current timestamp. We use it to identify users that aren't logged in, so we can manage the coun of users in each portal
  const { uniqueId } = useContext(UniqueIdContext);

  // This is our room
  const [room, setRoom] = useState(null);
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

  // Our main render
  return (
    <div className="single-room">
      {/** This is the video chat, the embedded streams, the Mixlr and the Multiverse*/}
      <Media
        room={room}
        currentAudioChannel={currentAudioChannel}
        match={match}
      />

      {/** This is the room info the calendar and the donations*/}
      <Details room={room} setRoom={setRoom} />

      {/** This is the audio settings and the admin*/}
      <Management room={room} currentAudioChannel={currentAudioChannel} />

      {/** This is the comments*/}
      {room ? <Comments room={room} match={match} /> : null}
    </div>
  );
};

export default connect(null, {
  fetchSingleRoom,
})(SingleRoom);
