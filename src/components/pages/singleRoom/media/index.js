import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";

import { isMobile } from "react-device-detect";

import { UniqueIdContext } from "../../../../providers/UniqueId";
import { AuthContext } from "../../../../providers/Auth";

import {
  listenToMultiverse,
  detachMultiverseListener,
  newPortal,
} from "../../../../actions/portals";

import {
  detachChannelListener,
} from "../../../../actions/rooms";

import { titleToKey } from "../../../../utils/strings";

import Chat from "./chat";
import Youtube from "./youtube";
import Twitch from "./twitch";
import Multiverse from "./multiverse";
import MobileMultiverse from "./mobileMultiverse";
import Mixlr from "./mixlr";
import { connect } from "react-redux";
import Notice from "./notice";
import { FloorContext } from "../../../../providers/Floor";

const Media = ({
  room,
  roomIndex,
  floor,
  currentAudioChannel,
  entityID,
  isOwner,
  listenToMultiverse,
  detachMultiverseListener,
  detachChannelListener,
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

  // This holds the state of the media toggle - are we viewing the chat or the stream
  const [mediaState, setMediaState] = useState(false);

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
      detachChannelListener()
    };
  }, [entityID, currentPortal, currentUserProfile, uniqueId]);

  // Whenever the room or the current portal change, we set a new portal url
  useEffect(() => {
    if (!currentPortal || !room) return;

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
    console.log("audio channel media", currentAudioChannel);
    if (
      currentAudioChannel &&
      currentAudioChannel.source &&
      ["youtube", "twitch"].includes(currentAudioChannel.source)
    ) {
      setIsVideoVisible(true);
      // setMediaState(1);
    }
  }, [currentAudioChannel]);

  const renderControllers = () => {
    return (
      <div className="media__buttons">
        {isChatVisible ? (
          <div
            className="media__button media__button--active"
            onClick={() => setIsChatVisible(false)}
          >
            Chat
          </div>
        ) : (
          <div
            className="media__button media__button--unactive"
            onClick={() => setIsChatVisible(true)}
          >
            Chat
          </div>
        )}

        {isVideoVisible ? (
          <div
            className="media__button media__button--active"
            onClick={() => setIsVideoVisible(false)}
          >
            Stream
          </div>
        ) : (
          <div
            className="media__button media__button--unactive"
            onClick={() => setIsVideoVisible(true)}
          >
            Stream
          </div>
        )}
      </div>
    );
  };

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

  return (
    <div className="media single-room__media">
      {isMobile ? (
        <Notice text='To join the party on mobile, you will need to switch to desktop mode in your browser app. On Chrome, click the three dots at the top right of your screen and check "Desktop site".' />
      ) : null}

      {!isMobile && currentAudioChannel && currentAudioChannel.source ? (
        <Notice
          text="Please listen to the music using a headset, or disable your
            microphone in the chat to prevent noise for the other participants"
          currentAudioChannel={currentAudioChannel}
        />
      ) : null}

      {/** This is the multiverse*/}
      {!isMobile && room ? (
        <Multiverse
          room={room}
          currentPortal={currentPortal}
          setCurrentPortal={setCurrentPortal}
          multiverse={multiverse}
          multiverseArray={multiverseArray}
          currentAudioChannel={currentAudioChannel}
          microphonePermissionGranted={microphonePermissionGranted}
          cameraPermissionGranted={cameraPermissionGranted}
          entityID={entityID}
          isFirstLoad={isFirstLoad}
          setIsFirstLoad={setIsFirstLoad}
        />
      ) : null}

      {isMobile && room ? (
        <MobileMultiverse
          entityID={entityID}
          multiverseArray={multiverseArray}
        />
      ) : null}

      {currentAudioChannel && currentAudioChannel.source === "mixlr" ? (
        <Mixlr ID={currentAudioChannel.link} />
      ) : null}

      <div
        className={
          currentAudioChannel && currentAudioChannel.source
            ? "media__toggle--with-audio"
            : "media__toggle--no-audio"
        }
      >
        <input
          className="media__chat-checkbox"
          type="checkbox"
          id="chat-visibility-checkbox"
          checked={isChatVisible}
          readOnly
        />

        <input
          className="media__video-checkbox"
          type="checkbox"
          id="video-visibility-checkbox"
          checked={isVideoVisible}
          readOnly
        />

        {!isMobile ? (
          <>
            {/* <div className="media__chat-stream-container"> */}
            {isChatVisible ? (
              <span className="media__chat">
                <Chat
                  room={room}
                  floor={floor}
                  currentPortalUrl={currentPortalUrl}
                  cameraPermissionGranted={cameraPermissionGranted}
                  setCameraPermissionGranted={setCameraPermissionGranted}
                  microphonePermissionGranted={microphonePermissionGranted}
                  setMicrophonePermissionGranted={
                    setMicrophonePermissionGranted
                  }
                  isFirstLoad={isFirstLoad}
                />
              </span>
            ) : null}

            {currentAudioChannel && currentAudioChannel.source === "youtube" ? (
              <span className="media__stream">
                <Youtube ID={currentAudioChannel.link} isVideoVisible={isVideoVisible}/>
              </span>
            ) : null}

            {currentAudioChannel && currentAudioChannel.source === "twitch" ? (
              <span className="media__stream">
                <Twitch ID={currentAudioChannel.link} isVideoVisible={isVideoVisible}/>
              </span>
            ) : null}
            {/* </div> */}

            {/* {renderControllers()} */}

            {currentAudioChannel &&
            ["youtube", "twitch"].includes(currentAudioChannel.source)
              ? renderControllers()
              : null}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default connect(null, { listenToMultiverse, detachMultiverseListener,detachChannelListener, newPortal })(
  Media
);

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
