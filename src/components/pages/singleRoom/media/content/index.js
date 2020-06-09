import "./styles.scss";
import React, { useEffect } from "react";

import { isMobile } from "react-device-detect";

import Notice from "./notice";

import Mixlr from "../../unused/mixlr";
import IFrame from "./iframe";
import Chat from "./chat";
import {
  getIframeUrl,
  getIframeHeight,
  renderControllers,
} from "./iframe/utils";

const MediaContent = ({
  room,
  floor,
  currentAudioChannel,
  microphonePermissionGranted,
  cameraPermissionGranted,
  isFirstLoad,
  isChatVisible,
  setIsChatVisible,
  isVideoVisible,
  setIsVideoVisible,
  setCameraPermissionGranted,
  setMicrophonePermissionGranted,
  currentPortalUrl,
}) => {

  useEffect(() => {
    console.log("currentAudioChannel content", currentAudioChannel)
  },[currentAudioChannel])

  return (
    <div className="content media__content">
      <input
        className="invisible"
        type="checkbox"
        id="chat-visibility-checkbox"
        checked={isChatVisible}
        readOnly
      />
      <input
        className="invisible"
        type="checkbox"
        id="video-visibility-checkbox"
        checked={isVideoVisible}
        readOnly
      />
      {!isMobile ? (
        <div className="fr">
          {isChatVisible ? (
            <Chat
              // room={room}
              floor={floor}
              currentPortalUrl={currentPortalUrl}
              cameraPermissionGranted={cameraPermissionGranted}
              setCameraPermissionGranted={setCameraPermissionGranted}
              microphonePermissionGranted={microphonePermissionGranted}
              setMicrophonePermissionGranted={setMicrophonePermissionGranted}
              isFirstLoad={isFirstLoad}
            />
          ) : null}

          {isVideoVisible &&
          currentAudioChannel &&
          currentAudioChannel.source ? (
            <IFrame
              url={getIframeUrl(currentAudioChannel)}
              height={getIframeHeight(currentAudioChannel)}
              source={currentAudioChannel.source}
            />
          ) : null}

          {isVideoVisible &&
          isChatVisible &&
          !isMobile &&
          currentAudioChannel &&
          currentAudioChannel.source ? (
            <Notice
              text="Please listen to the music using a headset, or disable your
            microphone in the chat to prevent noise for the other participants"
              currentAudioChannel={currentAudioChannel}
            />
          ) : null}

          {currentAudioChannel && currentAudioChannel.source
            ? renderControllers(
                isChatVisible,
                setIsChatVisible,
                isVideoVisible,
                setIsVideoVisible
              )
            : null}
        </div>
      ) : null}
    </div>
  );
};

export default MediaContent;
