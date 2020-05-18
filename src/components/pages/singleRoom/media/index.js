import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";

import { isMobile } from "react-device-detect";

import { UniqueIdContext } from "../../../../providers/UniqueId";
import { AuthContext } from "../../../../providers/Auth";
import { FloorContext } from "../../../../providers/Floor";

import {
  listenToMultiverse,
  detachMultiverseListener,
  newPortal,
} from "../../../../actions/portals";

import { titleToKey } from "../../../../utils/strings";

import SideBar from "./sideBar";
import MediaContent from "./content";

const Media = ({
  room,
  roomIndex,
  floor,
  currentAudioChannel,
  entityID,
  isOwner,
  listenToMultiverse,
  detachMultiverseListener,
  newPortal,
}) => {
  // This is a fake unique id based on current timestamp. We use it to identify users that aren't logged in, so we can manage the coun of users in each portal
  const { uniqueId } = useContext(UniqueIdContext);
  const { currentUserProfile } = useContext(AuthContext);
  const { setFloorTempVideoChat } = useContext(FloorContext);

  // This holds the current portal were in (its title)
  const [currentPortal, setCurrentPortal] = useState(null);

  // This holds the url og the current portal (it's a mix of the portal's title with the room's ID)
  const [currentPortalUrl, setCurrentPortalUrl] = useState(null);

  // This is the multivers - a documents with info of all our portals
  const [multiverse, setMultiverse] = useState(null);

  // This is the same multiverse just as an array of objects rather as an object
  const [multiverseArray, setMultiverseArray] = useState(null);

  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isVideoVisible, setIsVideoVisible] = useState(true);

  // This keeps track if it's our first time loading. On our first load, we set the portal to the fullest one in our multiverse. After that it's up to the user to decide. It's important to have it because we set the portal when we get an update for the multiverse
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Holds permissions status
  const [
    microphonePermissionGranted,
    setMicrophonePermissionGranted,
  ] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);


  useEffect(() => {
    listenToMultiverse(entityID, setMultiverse, setMultiverseArray, () => {
      newPortal(
        { title: "Home" },
        null,
        entityID,
        currentUserProfile && currentUserProfile.uid
          ? currentUserProfile.uid
          : uniqueId,
        (portalObj) => {
          setCurrentPortal(portalObj);
        }
      );
    });
    return function cleanup() {
      detachMultiverseListener();
    };
  }, [entityID, currentPortal, currentUserProfile, uniqueId]);

  // Whenever the room or the current portal change, we set a new portal url
  useEffect(() => {
    if (!currentPortal || !currentPortal.new || !room) return;

    const portalUrlKey = titleToKey(
      floor
        ? currentPortal.new.title + floor.id + room.id
        : currentPortal.new.title + room.id
    );

    setCurrentPortalUrl(portalUrlKey);
    setFloorTempVideoChat(portalUrlKey);

    // if (microphonePermissionGranted && cameraPermissionGranted)

    // enterPortal(
    //   entityID,
    //   currentPortal,
    //   currentUserProfile && currentUserProfile.uid
    //     ? currentUserProfile.uid
    //     : uniqueId
    // );
  }, [
    currentPortal,
    room,
    microphonePermissionGranted,
    cameraPermissionGranted,
  ]);

  useEffect(() => {
    if (
      currentAudioChannel &&
      currentAudioChannel.source &&
      ["youtube", "twitch"].includes(currentAudioChannel.source)
    ) {
      setIsVideoVisible(true);
    }
  }, [currentAudioChannel]);

  return (
    <div className="media single-room__media">
      <SideBar
        room={room}
        currentAudioChannel={currentAudioChannel}
        entityID={entityID}
        currentPortal={currentPortal}
        setCurrentPortal={setCurrentPortal}
        multiverse={multiverse}
        multiverseArray={multiverseArray}
        microphonePermissionGranted={microphonePermissionGranted}
        cameraPermissionGranted={cameraPermissionGranted}
        isFirstLoad={isFirstLoad}
        setIsFirstLoad={setIsFirstLoad}
        isChatVisible={isChatVisible}
        setIsChatVisible={setIsChatVisible}
        isVideoVisible={isVideoVisible}
        setIsVideoVisible={setIsVideoVisible}
      />

      <MediaContent
        room={room}
        floor={floor}
        currentAudioChannel={currentAudioChannel}
        entityID={entityID}
        currentPortal={currentPortal}
        setCurrentPortal={setCurrentPortal}
        multiverse={multiverse}
        multiverseArray={multiverseArray}
        microphonePermissionGranted={microphonePermissionGranted}
        cameraPermissionGranted={cameraPermissionGranted}
        isFirstLoad={isFirstLoad}
        setIsFirstLoad={setIsFirstLoad}
        isChatVisible={isChatVisible}
        setIsChatVisible={setIsChatVisible}
        isVideoVisible={isVideoVisible}
        setIsVideoVisible={setIsVideoVisible}
        setMicrophonePermissionGranted={setMicrophonePermissionGranted}
        setCameraPermissionGranted={setCameraPermissionGranted}
        currentPortalUrl={currentPortalUrl}
      />
    </div>
  );
};

export default connect(null, {
  listenToMultiverse,
  detachMultiverseListener,
  newPortal,
})(Media);

// {!isMobile ? (
//   <>
//     <div className="media__toggle-container">
//       <span className="media__toggle-container--visible">
//         <Chat
//           room={room}
//           floor={floor}
//           currentPortalUrl={currentPortalUrl}
//           cameraPermissionGranted={cameraPermissionGranted}
//           setCameraPermissionGranted={setCameraPermissionGranted}
//           microphonePermissionGranted={microphonePermissionGranted}
//           setMicrophonePermissionGranted={
//             setMicrophonePermissionGranted
//           }
//           isFirstLoad={isFirstLoad}
//         />
//       </span>
//       {currentAudioChannel &&
//       currentAudioChannel.source === "youtube" ? (
//         <span className="media__toggle-container--hidden">
//           <Youtube ID={currentAudioChannel.link} />
//         </span>
//       ) : null}

//       {currentAudioChannel &&
//       currentAudioChannel.source === "twitch" ? (
//         <span className="media__toggle-container--hidden">
//           <Twitch ID={currentAudioChannel.link} />
//         </span>
//       ) : null}
//     </div>
//     {currentAudioChannel &&
//     ["youtube", "twitch"].includes(currentAudioChannel.source)
//       ? renderControllers()
//       : null}
//   </>
// ) : null}

// {
/* {currentAudioChannel && currentAudioChannel.source === "youtube" ? (
              <span className="media__stream">
                <Youtube
                  ID={currentAudioChannel.link}
                  isVideoVisible={isVideoVisible}
                />
              </span>
            ) : null}

            {currentAudioChannel && currentAudioChannel.source === "twitch" ? (
              <span className="media__stream">
                <Twitch
                  ID={currentAudioChannel.link}
                  isVideoVisible={isVideoVisible}
                />
              </span>
            ) : null} */
// }
// {
/* </div> */
// }

// {
/* {renderControllers()} */
// }

// const renderControllers = () => {
//   return (
//     <div className="media__buttons">
//       {mediaState ? (
//         <div
//           className="media__button media__button--unactive"
//           onClick={() => setMediaState(0)}
//         >
//           Chat
//         </div>
//       ) : (
//         <div className="media__button media__button--active">Chat</div>
//       )}

//       {!mediaState ? (
//         <div
//           className="media__button media__button--unactive"
//           onClick={() => setMediaState(1)}
//         >
//           Stream
//         </div>
//       ) : (
//         <div className="media__button media__button--active">Stream</div>
//       )}
//     </div>
//   );
// };
