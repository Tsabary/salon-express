import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";
import { UniqueIdContext } from "../../../providers/UniqueId";
import { RoomContext } from "../../../providers/Room";

import { fetchStrangerProfile } from "../../../actions/profiles";
import {
  listenToLoungeRequest,
  detachLoungeListener,
} from "../../../actions/rooms";

import Comments from "./comments";
import Media from "./media";
import Management from "./management";
import ProfileInfo from "./profileInfo";
import ProfileEditSlider from "./profileEditSlider";
import Lounge from "./lounge";
import ProfileSettingsSlider from "./profileSettingsSlider";

const ProfileRoom = ({
  match,
  fetchStrangerProfile,
  listenToLoungeRequest,
  detachLoungeListener,
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { globalCurrentAudioChannel } = useContext(RoomContext);
  const { uniqueId } = useContext(UniqueIdContext);

  const [profile, setProfile] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isProfileEdited, setIsProfileEdited] = useState(false);
  const [isSettingsEdited, setIsSettingsEdited] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [loungeMessages, setLoungeMessages] = useState([]);
  const [values, setValues] = useState();

  useEffect(() => {
    if (!profile) return;

    setIsOwner(
      currentUserProfile && currentUserProfile.username === profile.username
    );

    if (!currentUserProfile || profile.uid !== currentUserProfile.uid) {
      listenToLoungeRequest(
        `user-${profile.uid}`,
        currentUserProfile ? currentUserProfile.uid : uniqueId,
        setIsApproved,
        setIsWaiting,
        setLoungeMessages
      );
    }

    return function cleanup() {
      detachLoungeListener();
    };
  }, [currentUserProfile, profile, uniqueId]);

  useEffect(() => {
    if (!uniqueId) return;
    reset();
  }, [uniqueId, currentUserProfile]);

  // This happens when the room first loads. We take the id of the room and also the fake uid (return if it's not set yet) and we fetch the rooms data. There's also a callback for creating a new portal called home in case there aren't any portals in this room yet
  useEffect(() => {
    if (!uniqueId) return;

    if (match.params.id)
      fetchStrangerProfile(match.params.id, (profile) => setProfile(profile));
  }, [match.params.id, uniqueId]);

  const reset = () => {
    if (currentUserProfile) {
      setValues({
        // user_ID: currentUserProfile.uid,
        name: currentUserProfile.name,
        username: currentUserProfile.username,
        avatar: currentUserProfile.avatar,
      });
    } else {
      setValues({
        user_ID: uniqueId,
      });
    }
  };

  // Our main render
  return !profile ? null : (
    <div className="single-room">
      {/* We replace this with profile info  */}
      <ProfileInfo
        profile={profile}
        isOwner={isOwner}
        setIsProfileEdited={setIsProfileEdited}
        setIsSettingsEdited={setIsSettingsEdited}
      />

      <ProfileEditSlider
        profile={profile}
        isProfileEdited={isProfileEdited}
        setIsProfileEdited={setIsProfileEdited}
      />

      <ProfileSettingsSlider
        profile={profile}
        isSettingsEdited={isSettingsEdited}
        setIsSettingsEdited={setIsSettingsEdited}
      />

      {isApproved || isOwner || !profile.private ? (
        <Media
          profile={profile}
          currentAudioChannel={globalCurrentAudioChannel}
          entityID={`user-${profile.uid}`}
          isOwner={isOwner}
        />
      ) : (
        <Lounge
          profile={profile}
          isWaiting={isWaiting}
          values={values}
          setValues={setValues}
          reset={reset}
          loungeMessages={loungeMessages}
        />
      )}

      <Management
        entityID={`user-${profile.uid}`}
        currentAudioChannel={globalCurrentAudioChannel}
        isOwner={isOwner}
      />

      <Comments entityID={`user-${profile.uid}`} isOwner={isOwner} />
    </div>
  );
};

//   // Our main render
//   return !profile ? null : isApproved || isOwner || !profile.private ? (
//     <div className="single-room">
//       {/* We replace this with profile info  */}
//       <ProfileInfo
//         profile={profile}
//         isOwner={isOwner}
//         setIsProfileEdited={setIsProfileEdited}
//       />

//       {/* We replace this with edit profile  */}
//       <ProfileEditSlider
//         profile={profile}
//         isProfileEdited={isProfileEdited}
//         setIsProfileEdited={setIsProfileEdited}
//       />

//       <Media
//         currentAudioChannel={globalCurrentAudioChannel}
//         entityID={`user-${profile.uid}`}
//         isOwner={isOwner}
//       />

//       <Management
//         entityID={`user-${profile.uid}`}
//         currentAudioChannel={globalCurrentAudioChannel}
//         isOwner={isOwner}
//       />

//       <Comments entityID={`user-${profile.uid}`} />
//     </div>
//   ) : (
//     <div className="single-room">
//       <ProfileInfo
//         profile={profile}
//         isOwner={isOwner}
//         setIsProfileEdited={setIsProfileEdited}
//       />
//       <Lounge
//         profile={profile}
//         isWaiting={isWaiting}
//         values={values}
//         setValues={setValues}
//         reset={reset}
//         loungeMessages={loungeMessages}
//       />
//     </div>
//   );
// };

export default connect(null, {
  fetchStrangerProfile,
  listenToLoungeRequest,
  detachLoungeListener,
})(ProfileRoom);
