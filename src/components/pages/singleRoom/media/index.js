import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";

import { isMobile } from "react-device-detect";

import { UniqueIdContext } from "../../../../providers/UniqueId";
import { AuthContext } from "../../../../providers/Auth";

import { enterPortal } from "../../../../actions";
import { titleToKey } from "../../../../utils/strings";

import Chat from "./chat";
import Youtube from "./youtube";
import Twitch from "./twitch";
import Multiverse from "./multiverse";
import MobileMultiverse from "./mobileMultiverse";
import Mixlr from "./mixlr";

const Media = ({ match, room, currentAudioChannel }) => {
  // This is a fake unique id based on current timestamp. We use it to identify users that aren't logged in, so we can manage the coun of users in each portal
  const { uniqueId } = useContext(UniqueIdContext);
  const { currentUserProfile } = useContext(AuthContext);

  // This holds the current portal were in (its title)
  const [currentPortal, setCurrentPortal] = useState(null);

  // This holds the state of the media toggle - are we viewing the chat or the stream
  const [mediaState, setMediaState] = useState(false);

  // Holds permissions status
  const [
    microphonePermissionGranted,
    setMicrophonePermissionGranted,
  ] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);

  // This holds the url og the current portal (it's a mix of the portal's title with the room's ID)
  const [currentPortalUrl, setCurrentPortalUrl] = useState(null);

  // Whenever the room or the current portal change, we set a new portal url
  useEffect(() => {
    if (!currentPortal || !room) return;
    setCurrentPortalUrl(titleToKey(currentPortal.title + room.id));
    if (microphonePermissionGranted && cameraPermissionGranted)
      enterPortal(
        room,
        currentPortal,
        currentUserProfile && currentUserProfile.uid
          ? currentUserProfile.uid
          : uniqueId
      );
  }, [
    currentPortal,
    room,
    microphonePermissionGranted,
    cameraPermissionGranted,
  ]);

  useEffect(() => {
    setMediaState(
      currentAudioChannel &&
        currentAudioChannel.source &&
        ["youtube", "twitch"].includes(currentAudioChannel.source)
    );
  }, [currentAudioChannel]);

  const renderControllers = () => {
    return (
      <div className="media__buttons">
        {mediaState ? (
          <div
            className="media__button media__button--unactive"
            onClick={() => setMediaState(!mediaState)}
            // htmlFor="media-toggle-checkbox"
          >
            Chat
          </div>
        ) : (
          <div className="media__button media__button--active">Chat</div>
        )}

        {!mediaState ? (
          <div
            className="media__button media__button--unactive"
            onClick={() => setMediaState(!mediaState)}
            // htmlFor="media-toggle-checkbox"
          >
            Stream
          </div>
        ) : (
          <div className="media__button media__button--active">Stream</div>
        )}
      </div>
    );
  };


  return (
    <div className="media single-room__media">
      {isMobile ? (
        <div className="media__no-mobile">
          To join the party on mobile, you will need the Jitsi app. Choose a
          portal from the multiverse to join.
        </div>
      ) : null}

      {/** This is the multiverse*/}
      {!isMobile && room ? (
        <Multiverse
          room={room}
          currentPortal={currentPortal}
          setCurrentPortal={setCurrentPortal}
          currentAudioChannel={currentAudioChannel}
          microphonePermissionGranted={microphonePermissionGranted}
          cameraPermissionGranted={cameraPermissionGranted}
          match={match}
        />
      ) : null}

      {isMobile && room ? <MobileMultiverse room={room} /> : null}

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
          className="media__toggle-checkbox"
          type="checkbox"
          id="media-toggle-checkbox"
          onChange={() => {
            setMediaState(!mediaState);
          }}
          checked={mediaState}
        />
        {!isMobile ? (
          <>
            <div className="media__toggle-container">
              <span className="media__toggle-container--visible">
                <Chat
                  room={room}
                  currentPortalUrl={currentPortalUrl}
                  cameraPermissionGranted={cameraPermissionGranted}
                  setCameraPermissionGranted={setCameraPermissionGranted}
                  microphonePermissionGranted={microphonePermissionGranted}
                  setMicrophonePermissionGranted={
                    setMicrophonePermissionGranted
                  }
                />
              </span>
              {currentAudioChannel &&
              currentAudioChannel.source === "youtube" ? (
                <span className="media__toggle-container--hidden">
                  <Youtube ID={currentAudioChannel.link} />
                </span>
              ) : null}

              {currentAudioChannel &&
              currentAudioChannel.source === "twitch" ? (
                <span className="media__toggle-container--hidden">
                  <Twitch ID={currentAudioChannel.link} />
                </span>
              ) : null}
            </div>
            {currentAudioChannel &&
            ["youtube", "twitch"].includes(currentAudioChannel.source)
              ? renderControllers()
              : null}{" "}
          </>
        ) : null}

        {!isMobile &&
        currentAudioChannel &&
        ["youtube", "twitch"].includes(currentAudioChannel.source) ? (
          <div className="media__no-mobile">
            Please listen to the music using a headset, or disable your
            microphone in the chat to prevent noise for the other participants
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Media;
