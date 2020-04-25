import "./styles.scss";
import React, { useEffect } from "react";

import { isMobile } from "react-device-detect";
import Iframe from "react-iframe";

const Chat = ({
  room,
  currentPortalUrl,
  cameraPermissionGranted,
  setCameraPermissionGranted,
  microphonePermissionGranted,
  setMicrophonePermissionGranted,
}) => {
  useEffect(() => {
    console.log("mineperms", cameraPermissionGranted);
    console.log("mineperms", microphonePermissionGranted);
  }, [cameraPermissionGranted, microphonePermissionGranted]);

  useEffect(() => {
    if (!navigator || (navigator && !navigator.permissions)) return;
    console.log("mineperms", "procceeding");
    navigator.permissions
      .query({ name: "microphone" })
      .then((permissionStatus) => {
        console.log("mineperms status mic", permissionStatus);

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
        console.log("mineperms status cam", permissionStatus);

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
        url={room ? "https://meet.jit.si/SalExp-" + currentPortalUrl : ""}
        width="100%"
        height="450px"
        id="myId"
        display="initial"
        position="relative"
        allow="fullscreen; camera; microphone"
        className="single-room__chat"
      />
    ) : (
      <div className="single-room__access-container">
        <div className="single-room__access-buttons">
          {microphonePermissionGranted ? (
            <div className="single-room__access-button single-room__access-button--unactive">
              Microphone Permission Granted
            </div>
          ) : (
            <div
              className="single-room__access-button single-room__access-button--active"
              onClick={() =>
                requestPermission({ audio: true, video: false }, "mic")
              }
            >
              Grant Microphone Permission
            </div>
          )}

          {cameraPermissionGranted ? (
            <div className="single-room__access-button single-room__access-button--unactive">
              Camera Permission Granted
            </div>
          ) : (
            <div
              className="single-room__access-button single-room__access-button--active"
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

export default Chat;
