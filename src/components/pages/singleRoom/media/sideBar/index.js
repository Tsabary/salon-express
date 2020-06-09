import "./styles.scss";
import React from "react";
import { isMobile } from "react-device-detect";

import MobileMultiverse from "./mobileMultiverse";
import Multiverse from "./multiverse";
import UserSocial from "../../../../otherComponents/userSocial";
import CallToAction from "./callToAction";

const SideBar = ({
  currentAudioChannel,
  profile,
  entityID,
  currentPortal,
  setCurrentPortal,
  multiverse,
  multiverseArray,
  microphonePermissionGranted,
  cameraPermissionGranted,
  isFirstLoad,
  setIsFirstLoad,
  isChatVisible,
  isVideoVisible,
}) => {
  const getClassName = (isChatVisible, isVideoVisible, user) => {
    switch (true) {
      case isChatVisible && isVideoVisible && user:
        return "media-sidebar media-sidebar--both media__sidebar";

      case isChatVisible && isVideoVisible && !user:
        return "media-sidebar media-sidebar--one media__sidebar";

      case (isChatVisible && !isVideoVisible) ||
        (!isChatVisible && isVideoVisible && user):
        return "media-sidebar media-sidebar--one media__sidebar";

      case !isChatVisible && isVideoVisible && user:
        return "media-sidebar media-sidebar--one media__sidebar";

      case !isChatVisible && isVideoVisible && !user:
        return "media-sidebar media-sidebar--none media__sidebar";

      case !isChatVisible && !isVideoVisible && user:
        return "media-sidebar media-sidebar--none media__sidebar";
    }
  };

  const renderLinks = (links) => {
    return links.map((link) => {
      return (
        <a
          className="small-button"
          href={`https://${link.url}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.title}
        </a>
      );
    });
  };

  return (
    <div
      className={getClassName(
        isChatVisible,
        isVideoVisible,
        currentAudioChannel && currentAudioChannel.user ? true : false
      )}
    >
      {!isMobile && entityID && isChatVisible ? (
        <Multiverse
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
          isChatVisible={isChatVisible}
          isVideoVisible={isVideoVisible}
        />
      ) : null}

      {isVideoVisible && currentAudioChannel ? (
        <div
          className={
            isChatVisible
              ? "media-sidebar__user section__container"
              : "media-sidebar__user--lean section__container"
          }
        >
          {profile && profile.links ? (
            <div>
              <div className="section__title">Redirects</div>
              <div className="fr">{renderLinks(profile.links)}</div>
            </div>
          ) : currentAudioChannel.user ? (
            <div>
              <div className="section__title">Currently Live</div>
              <UserSocial uid={currentAudioChannel.user.uid} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* {!isVideoVisible ||
      !currentAudioChannel ? null : currentAudioChannel.user ? (
        <div
          className={
            isChatVisible
              ? "media-sidebar__user section__container"
              : "media-sidebar__user--lean section__container"
          }
        >
          <div className="section__title">Currently Live</div>
          <UserSocial uid={currentAudioChannel.user.uid} />
        </div>
      ) : null}
      {currentAudioChannel && currentAudioChannel.source ? (
        <CallToAction />
      ) : null} */}
    </div>
  );
};

export default SideBar;
