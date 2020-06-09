import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { StickyContainer, Sticky } from "react-sticky";

import { AuthContext } from "../../../providers/Auth";
import { UniqueIdContext } from "../../../providers/UniqueId";
import { RoomContext } from "../../../providers/Room";

import { fetchSingleRoom, detachChannelListener } from "../../../actions/rooms";

import Comments from "./comments";
import Media from "./media";
import Management from "./management";
import EditSlider from "./editSlider";
import RoomInfo from "./info";

const PublicRoom = ({ match, fetchSingleRoom, detachChannelListener }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { globalRoom, setGlobalRoom } = useContext(RoomContext);
  const { uniqueId } = useContext(UniqueIdContext);

  const [roomId, setRoomId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isRoomEdited, setIsRoomEdited] = useState(false);

  useEffect(() => {
    setIsOwner(
      currentUserProfile &&
        globalRoom &&
        globalRoom.admins_ID.includes(currentUserProfile.uid)
    );
  }, [currentUserProfile, globalRoom]);

  // This happens when the room first loads. We take the id of the room and also the fake uid (return if it's not set yet) and we fetch the rooms data. There's also a callback for creating a new portal called home in case there aren't any portals in this room yet
  useEffect(() => {
    if (!uniqueId) return;

    const id = match.params.id.split("-");
    setRoomId(id[id.length - 1]);

    fetchSingleRoom(id[id.length - 1], setGlobalRoom);
  }, [match.params.id, uniqueId]);

  // Our main render
  return roomId ? (
    <div className="single-room">
      <RoomInfo
        room={globalRoom}
        setRoom={setGlobalRoom}
        isOwner={isOwner}
        setIsRoomEdited={setIsRoomEdited}
      />

      <EditSlider
        room={globalRoom}
        isRoomEdited={isRoomEdited}
        setIsRoomEdited={setIsRoomEdited}
      />

      <Media
        entityID={roomId}
        isOwner={isOwner}
      />

      <Management
        entityID={roomId}
        isOwner={isOwner}
      />

      {globalRoom ? <Comments entityID={roomId} isOwner={isOwner}/> : null}
    </div>
  ) : null;
};

export default connect(null, {
  fetchSingleRoom,
  detachChannelListener,
})(PublicRoom);
