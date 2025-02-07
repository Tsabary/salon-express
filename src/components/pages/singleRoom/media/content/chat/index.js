import "./styles.scss";
import React, { useEffect, useContext } from "react";
import { connect } from "react-redux";

import { isMobile } from "react-device-detect";
import Iframe from "react-iframe";

import { logGuestEntry } from "../../../../../../actions/rooms";
import { AuthContext } from "../../../../../../providers/Auth";

const Chat = ({
  room,
  floor,
  currentPortalUrl,
  cameraPermissionGranted,
  setCameraPermissionGranted,
  microphonePermissionGranted,
  setMicrophonePermissionGranted,
  isFirstLoad,
  logGuestEntry,
}) => {
  const { currentUserProfile } = useContext(AuthContext);


  // Send the update to all followers that someone has entered the room. Only do it when isFirstLoad is false, becasue that's the indicatir they've actually entered the room
  useEffect(() => {
    if (!cameraPermissionGranted || !microphonePermissionGranted || isFirstLoad || floor)
      return;
    // logGuestEntry(room, currentUserProfile);
  }, [cameraPermissionGranted, microphonePermissionGranted, isFirstLoad]);

  useEffect(() => {
    if (!navigator || (navigator && !navigator.permissions)) return;

    navigator.permissions
      .query({ name: "microphone" })
      .then((permissionStatus) => {

        setMicrophonePermissionGranted(permissionStatus.state === "granted");

        permissionStatus.onchange = function () {
          setMicrophonePermissionGranted(this.state === "granted");
        };
      })
      .catch((e) => {
        console.error("mineperms error mic", e);
      });

    navigator.permissions
      .query({ name: "camera" })
      .then((permissionStatus) => {
        setCameraPermissionGranted(permissionStatus.state === "granted");

        permissionStatus.onchange = function () {
          setCameraPermissionGranted(this.state === "granted");
        };
      })
      .catch((e) => {
        console.error("mineperms error cam", e);
      });
  }, []);

  useEffect(() => {
    requestPermission({ audio: true, video: true });
  }, []);

  const requestPermission = (constraints, perm) => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        console.log("mineperms stream", stream);
        switch (perm) {
          case "cam":
            setCameraPermissionGranted(true);
            break;

          case "mic":
            setMicrophonePermissionGranted(true);
            break;
        }
      })
      .catch((err) => {
        console.log("mineperms error", err);
      });
  };

  return currentPortalUrl && !isMobile ? (
    cameraPermissionGranted && microphonePermissionGranted ? (
      <Iframe
        url={currentPortalUrl ? "https://meet.jit.si/salexp" + currentPortalUrl : ""}
        width="100%"
        height="450px"
        id="myId"
        display="initial"
        position="relative"
        allow="fullscreen; camera; microphone"
        className="chat__content"
      />
    ) : (
      <div className="chat__access-container">
        <div className="chat__access-buttons">
          {microphonePermissionGranted ? (
            <div className="chat__access-button chat__access-button--unactive">
              Microphone Permission Granted
            </div>
          ) : (
            <div
              className="chat__access-button chat__access-button--active"
              onClick={() =>
                requestPermission({ audio: true, video: false }, "mic")
              }
            >
              Grant Microphone Permission
            </div>
          )}

          {cameraPermissionGranted ? (
            <div className="chat__access-button chat__access-button--unactive">
              Camera Permission Granted
            </div>
          ) : (
            <div
              className="chat__access-button chat__access-button--active"
              onClick={() =>
                requestPermission({ audio: false, video: true }, "cam")
              }
            >
              Grant Camera Permission
            </div>
          )}
        </div>
      </div>
    )
  ) : null;
};

export default connect(null, { logGuestEntry })(Chat);
