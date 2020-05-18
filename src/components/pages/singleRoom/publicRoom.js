import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";
import { UniqueIdContext } from "../../../providers/UniqueId";
import { RoomContext } from "../../../providers/Room";

import { fetchSingleRoom, detachChannelListener } from "../../../actions/rooms";

import Comments from "./comments";

import Media from "./media";
import Details from "./details";
import Management from "./management";

const PublicRoom = ({ match, fetchSingleRoom, detachChannelListener }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { setGlobalCurrentAudioChannel } = useContext(RoomContext);
  const { setGlobalRoom } = useContext(RoomContext);
  const [roomId, setRoomId] = useState(null)

  // This is a fake unique id based on current timestamp. We use it to identify users that aren't logged in, so we can manage the coun of users in each portal
  const { uniqueId } = useContext(UniqueIdContext);

  // This is our room
  const [room, setRoom] = useState(null);
  const [currentAudioChannel, setCurrentAudioChannel] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    setIsOwner(
      currentUserProfile &&
        room &&
        room.admins_ID.includes(currentUserProfile.uid)
    );
  }, [currentUserProfile, room]);

  // This happens when the room first loads. We take the id of the room and also the fake uid (return if it's not set yet) and we fetch the rooms data. There's also a callback for creating a new portal called home in case there aren't any portals in this room yet
  useEffect(() => {
    if (!uniqueId) return;

    const id = match.params.id.split("-");
    setRoomId(id[id.length - 1])

    fetchSingleRoom(
      id[id.length - 1],
      setRoom,
      setGlobalRoom,
      setCurrentAudioChannel,
      setGlobalCurrentAudioChannel
    );

    return function cleanup() {
      detachChannelListener();
    };
  }, [match.params.id, uniqueId]);

  // Our main render
  return roomId ?(
    <div className="single-room">
      {/** This is the video chat, the embedded streams, the Mixlr and the Multiverse*/}
      <Media
        room={room}
        currentAudioChannel={currentAudioChannel}
        entityID={roomId}
        isOwner={isOwner}
      />

      {/** This is the room info the calendar and the donations*/}
      <Details room={room} setRoom={setRoom} isOwner={isOwner} />

      {/** This is the audio settings and the admin*/}
      <Management
        room={room}
        currentAudioChannel={currentAudioChannel}
        isOwner={isOwner}
      />

      {/** This is the comments*/}
      {room ? <Comments room={room} entityID={roomId} /> : null}
    </div>
  ) : null;
};

export default connect(null, {
  fetchSingleRoom,
  detachChannelListener,
})(PublicRoom);
