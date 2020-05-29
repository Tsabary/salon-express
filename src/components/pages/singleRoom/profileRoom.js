import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { StickyContainer, Sticky } from "react-sticky";

import { AuthContext } from "../../../providers/Auth";
import { UniqueIdContext } from "../../../providers/UniqueId";
import { RoomContext } from "../../../providers/Room";

import { fetchSingleRoom, detachChannelListener } from "../../../actions/rooms";
import { fetchStrangerProfile } from "../../../actions/profiles";

import Comments from "./comments";
import Media from "./media";
import Management from "./management";
import EditSlider from "./editSlider";
import RoomInfo from "./info";
import ProfileInfo from "./profileInfo";
import ProfileEditSlider from "./profileEditSlider";

const ProfileRoom = ({
  match,
  fetchStrangerProfile,
  detachChannelListener,
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { setGlobalCurrentAudioChannel } = useContext(RoomContext);
  const { globalRoom, setGlobalRoom } = useContext(RoomContext);
  const { uniqueId } = useContext(UniqueIdContext);

  const [profile, setProfile] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [currentAudioChannel, setCurrentAudioChannel] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isProfileEdited, setIsProfileEdited] = useState(false);

  useEffect(() => {
    if (!currentUserProfile || !profile) return;
    setIsOwner(currentUserProfile.username === profile.username);
  }, [currentUserProfile, profile]);

  // This happens when the room first loads. We take the id of the room and also the fake uid (return if it's not set yet) and we fetch the rooms data. There's also a callback for creating a new portal called home in case there aren't any portals in this room yet
  useEffect(() => {
    if (!uniqueId) return;

    if (match.params.id)
      fetchStrangerProfile(match.params.id, setCurrentAudioChannel, (profile) =>
        setProfile(profile)
      );

    // setRoomId(match.params.id);

    // fetchSingleRoom(
    //   id[id.length - 1],
    //   setGlobalRoom,
    //   setCurrentAudioChannel,
    //   setGlobalCurrentAudioChannel
    // );

    return function cleanup() {
      detachChannelListener();
    };
  }, [match.params.id, uniqueId]);

  // Our main render
  return profile ? (
    <div className="single-room">
      {/* We replace this with profile info  */}
      <ProfileInfo
        profile={profile}
        setRoom={setGlobalRoom}
        isOwner={isOwner}
        setIsProfileEdited={setIsProfileEdited}
      />

      {/* We replace this with edit profile  */}
     <ProfileEditSlider
        profile={profile}
        isProfileEdited={isProfileEdited}
        setIsProfileEdited={setIsProfileEdited}
      /> 

      <Media
        currentAudioChannel={currentAudioChannel}
        entityID={`user-${profile.uid}`}
        isOwner={isOwner}
      />

      <Management
        entityID={`user-${profile.uid}`}
        currentAudioChannel={currentAudioChannel}
        isOwner={isOwner}
      />

      <Comments entityID={`user-${profile.uid}`} />
    </div>
  ) : null;
};

export default connect(null, {
  fetchStrangerProfile,
  detachChannelListener,
})(ProfileRoom);
