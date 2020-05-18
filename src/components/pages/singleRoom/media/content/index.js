import "./styles.scss";
import React from "react";

import { isMobile } from "react-device-detect";

import Notice from "./notice";

import Mixlr from "./mixlr";
import IFrame from "./iframe";
import Chat from "./chat";

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
  const getIframeUrl = (audioChannel) => {
    switch (audioChannel.source) {
      case "youtube":
        return `https://www.youtube.com/embed/${audioChannel.link}?autoplay=true`;

      case "twitch":
        return `https://player.twitch.tv/?channel=${audioChannel.link}`;

      default:
        return audioChannel.link;
    }
  };

  const renderControllers = () => {
    return (
      <div className="content__buttons">
        {isChatVisible ? (
          <div
            className="content__button content__button--active"
            onClick={() => setIsChatVisible(false)}
          >
            Chat
          </div>
        ) : (
          <div
            className="content__button content__button--unactive"
            onClick={() => setIsChatVisible(true)}
          >
            Chat
          </div>
        )}

        {isVideoVisible ? (
          <div
            className="content__button content__button--active"
            onClick={() => setIsVideoVisible(false)}
          >
            Stream
          </div>
        ) : (
          <div
            className="content__button content__button--unactive"
            onClick={() => setIsVideoVisible(true)}
          >
            Stream
          </div>
        )}
      </div>
    );
  };

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
          {/* <div className="media__chat-stream-container"> */}
          {isChatVisible ? (
            <Chat
              room={room}
              floor={floor}
              currentPortalUrl={currentPortalUrl}
              cameraPermissionGranted={cameraPermissionGranted}
              setCameraPermissionGranted={setCameraPermissionGranted}
              microphonePermissionGranted={microphonePermissionGranted}
              setMicrophonePermissionGranted={setMicrophonePermissionGranted}
              isFirstLoad={isFirstLoad}
            />
          ) : null}

          {currentAudioChannel &&
          currentAudioChannel.source &&
          currentAudioChannel.source !== "mixlr" ? (
            <IFrame
              url={getIframeUrl(currentAudioChannel)}
              source={currentAudioChannel.source}
              isVideoVisible={isVideoVisible}
            />
          ) : null}

          {isMobile ? (
            <Notice text='To join the party on mobile, you will need to switch to desktop mode in your browser app. On Chrome, click the three dots at the top right of your screen and check "Desktop site".' />
          ) : null}

          {isVideoVisible && isChatVisible && !isMobile && currentAudioChannel && currentAudioChannel.source ? (
            <Notice
              text="Please listen to the music using a headset, or disable your
            microphone in the chat to prevent noise for the other participants"
              currentAudioChannel={currentAudioChannel}
            />
          ) : null}

          {currentAudioChannel && currentAudioChannel.source === "mixlr" ? (
            <Mixlr ID={currentAudioChannel.link} />
          ) : null}

          {currentAudioChannel &&
          ["youtube", "twitch", "website"].includes(currentAudioChannel.source)
            ? renderControllers()
            : null}
        </div>
      ) : null}
    </div>
  );
};

export default MediaContent;
