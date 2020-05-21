import "./styles.scss";
import React from "react";
import { isMobile } from "react-device-detect";

import MobileMultiverse from "./mobileMultiverse";
import Multiverse from "./multiverse";
import UserSocial from "../../../../otherComponents/userSocial";
import CallToAction from "./callToAction";

const SideBar = ({
  room,
  currentAudioChannel,
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
  return (
    <div className="sidebar media__sidebar">
      {!isMobile && room && isChatVisible ? (
        <div
          style={
            currentAudioChannel && currentAudioChannel.user && isVideoVisible
              ? { height: "450px" }
              : { height: "100%" }
          }
        >
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
        </div>
      ) : null}

      {currentAudioChannel && currentAudioChannel.user && isVideoVisible ? (
        <div
          className="section__container"
          style={{ height: "100%", minHeight: "450px" }}
        >
          <div className="section__title">Currently Live</div>
          <UserSocial uid={currentAudioChannel.user.uid} />
        </div>
      ) : isVideoVisible &&
        currentAudioChannel &&
        currentAudioChannel.source ? (
        <CallToAction />
      ) : null}

      {isMobile && room ? (
        <MobileMultiverse
          entityID={entityID}
          multiverseArray={multiverseArray}
        />
      ) : null}
    </div>
  );
};

export default SideBar;
