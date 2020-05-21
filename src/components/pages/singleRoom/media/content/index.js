import "./styles.scss";
import React, { useEffect } from "react";

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
  useEffect(() => {
    console.log("entityID content", currentPortalUrl);
  }, [currentPortalUrl]);

  const getIframeUrl = (audioChannel) => {
    switch (audioChannel.source) {
      case "youtube":
        return `https://www.youtube.com/embed/${audioChannel.link}?autoplay=true`;

      case "twitch":
        return `https://player.twitch.tv/?channel=${audioChannel.link}`;

      case "mixcloud":
        return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2F${audioChannel.link}`;

      default:
        return audioChannel.link;
    }
  };

  const getIframeHeight = (audioChannel) => {
    switch (audioChannel.source) {
      case "youtube":
        return 450;

      case "twitch":
        return 450;

      case "mixcloud":
        return 120;

      default:
        return 450;
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

          {isVideoVisible &&
          currentAudioChannel &&
          currentAudioChannel.source &&
          currentAudioChannel.source !== "mixlr" ? (
            <IFrame
                url={getIframeUrl(currentAudioChannel)}
                height={getIframeHeight(currentAudioChannel)}
              source={currentAudioChannel.source}
            />
          ) : null}

          {isVideoVisible &&
          currentAudioChannel &&
          currentAudioChannel.source === "mixlr" ? (
            <Mixlr ID={currentAudioChannel.link} />
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
            ? renderControllers()
            : null}
        </div>
      ) : null}
    </div>
  );
};

export default MediaContent;
