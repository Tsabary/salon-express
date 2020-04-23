import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import Iframe from "react-iframe";
import { isMobile } from "react-device-detect";

import { AuthContext } from "../../../providers/Auth";
import { UniqueIdContext } from "../../../providers/UniqueId";

import {
  fetchSingleRoom,
  fetchRoomComments,
  newComment,
  newPortal,
  associateWithRoom,
  keepRoomListed,
  updateRoom,
  enterPortal,
} from "../../../actions";

import { titleToKey } from "../../../utils/strings";

import AudioSettings from "./audioSettings";
import RoomInfo from "./roomInfo";
import Comments from "./comments";
import Admin from "./admin";
import Multiverse from "./multiverse";
import Streamer from "./streamer";
import Donations from "./donations";
import AudioPlayer from "./audioPlayer";

const SingleRoom = ({
  match,
  fetchSingleRoom,
  fetchRoomComments,
  enterPortal,
  newPortal,
}) => {
  const { currentUserProfile } = useContext(AuthContext);

  // This is a fake unique id based on current timestamp. We use it to identify users that aren't logged in, so we can manage the coun of users in each portal
  const { uniqueId } = useContext(UniqueIdContext);

  // This is our room
  const [room, setRoom] = useState(null);

  // This is the multivers - a documents with info of all our portals
  const [multiverse, setMultiverse] = useState(null);

  // This is the same multiverse just as an array of objects rather as an object
  const [multiverseArray, setMultiverseArray] = useState(null);

  // This is the array of all the comments
  const [comments, setComments] = useState([]);

  // We use this state to hold
  const [values, setValues] = useState({});

  // Holds permissions status
  const [
    microphonePermissionGranted,
    setMicrophonePermissionGranted,
  ] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);

  // This holds the current portal were in (its title)
  const [currentPortal, setCurrentPortal] = useState(null);

  // This holds the url og the current portal (it's a mix of the portal's title with the room's ID)
  const [currentPortalUrl, setCurrentPortalUrl] = useState(null);

  // This keeps track if it's our first time loading. On our first load, we set the portal to the fullest one in our multiverse. After that it's up to the user to decide. It's important to have it because we set the portal when we get an update for the multiverse
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [currentAudioChannel, setCurrentAudioChannel] = useState(null);

  useEffect(() => {
    navigator.permissions
      .query({ name: "microphone" })
      .then((permissionStatus) => {
        console.log("minemicrophone", permissionStatus.state); // granted, denied, prompt
        setMicrophonePermissionGranted(permissionStatus.state === "granted");

        permissionStatus.onchange = function () {
          console.log("minemicrophone", "Permission changed to " + this.state);
          setMicrophonePermissionGranted(this.state === "granted");
        };
      });

    navigator.permissions.query({ name: "camera" }).then((permissionStatus) => {
      console.log("minecamera", permissionStatus.state); // granted, denied, prompt
      setCameraPermissionGranted(permissionStatus.state === "granted");

      permissionStatus.onchange = function () {
        console.log("minecamera", "Permission changed to " + this.state);
        setCameraPermissionGranted(this.state === "granted");
      };
    });
  }, []);

  // This happens when the room first loads. We take the id of the room and also the fake uid (return if it's not set yet) and we fetch the rooms data. There's also a callback for creating a new portal called home in case there aren't any portals in this room yet
  useEffect(() => {
    if (!uniqueId) return;
    fetchSingleRoom(
      match.params.id,
      setRoom,
      setMultiverse,
      setMultiverseArray,
      setCurrentAudioChannel,
      isMobile,
      () => {
        newPortal(
          "Home",
          currentPortal,
          { id: match.params.id },
          currentUserProfile && currentUserProfile.uid
            ? currentUserProfile.uid
            : uniqueId,
          (portalObj) => {
            setValues({ ...values, portal: "" });
            setCurrentPortal(portalObj);
          }
        );
      }
    );
    fetchRoomComments(match.params.id, setComments);
  }, [match.params.id, uniqueId]);

  // This sets the value of the donations field (so that it'll be present in our edit component). Should just move to it's own component
  useEffect(() => {
    if (
      !room ||
      !currentUserProfile ||
      !currentUserProfile.uid ||
      room.user_ID !== currentUserProfile.uid
    )
      return;

    if (room.donations_url)
      setValues((val) => {
        return { ...val, donations_url: room.donations_url };
      });
  }, [currentUserProfile, room]);

  // If it's not the first load or if we don't have anything in the multiverse array then return, because we either don't need to automatically pick the portal (not the first load) or there is no portal to choose
  useEffect(() => {
    if (!isFirstLoad || !multiverseArray || !multiverseArray.length) return;
    {
      setCurrentPortal(multiverseArray[0]);
      setIsFirstLoad(false);
    }
  }, [multiverseArray]);

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

  const requestPermission = (constraints) => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        console.log("minee stream", stream);
      })
      .catch(function (err) {
        console.log("minee error", err);
      });
  };

  // Our main render
  return (
    <div className="single-room">
      {isMobile ? (
        <div className="single-room__container-no-mobile">
          We currently do not support video on mobile, please join the party on
          your desktop
        </div>
      ) : null}

      {/** This is the multiverse*/}
      {!isMobile && room ? (
        <Multiverse
          room={room}
          values={values}
          setValues={setValues}
          multiverse={multiverse}
          currentPortal={currentPortal}
          setCurrentPortal={setCurrentPortal}
          multiverseArray={multiverseArray}
          isFirstLoad={isFirstLoad}
          microphonePermissionGranted={microphonePermissionGranted}
          cameraPermissionGranted={cameraPermissionGranted}
          currentAudioChannel={currentAudioChannel}
        />
      ) : null}

      {/** This is the video chat*/}
      {!isMobile ? (
        <div className="single-room__container-chat">
          {currentPortalUrl && !isMobile ? (
            cameraPermissionGranted && microphonePermissionGranted ? (
              <div className="single-room__container-chat-chat">
              <Iframe
                url={
                  room ? "https://meet.jit.si/SalExp-" + currentPortalUrl : ""
                }
                width="100%"
                height="450px"
                id="myId"
                display="initial"
                position="relative"
                allow="fullscreen; camera; microphone"
                className="single-room__chat"
              /></div>
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
                        requestPermission({ audio: true, video: false })
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
                        requestPermission({ audio: false, video: true })
                      }
                    >
                      Grant Camera Permission
                    </div>
                  )}
                </div>
              </div>
            )
          ) : null}
        </div>
      ) : null}
      {/* <div
        className={
          isMobile
            ? "single-room__container-audio--mobile"
            : "single-room__container-audio--not-mobile"
        }
      > <AudioPlayer /></div>
      */}

      {/** This is the audio stream controller, if audio is being streamed*/}
      <div
        className={
          isMobile
            ? "single-room__container-audio--mobile"
            : "single-room__container-audio--not-mobile"
        }
      >
        {currentAudioChannel ? (
          <Iframe
            url={`https://mixlr.com/users/${currentAudioChannel}/embed?autoplay=true`}
            width="100%"
            height="180px"
            id="myId2"
            display="initial"
            position="relative"
            className="single-room__audio"
          />
        ) : null}
      </div>

      {/** This is the donations tile*/}
      {(room && room.accepting_donations) ||
      (currentUserProfile &&
        room &&
        currentUserProfile.uid === room.user_ID) ? (
        <div className="single-room__container-donations">
          <Donations room={room} />
        </div>
      ) : null}

      {/** This is the audio settings tile, in case the user is the page's admin*/}
      <div
        className={
          isMobile
            ? "single-room__container-mixlr"
            : "single-room__container-mixlr"
        }
      >
        {currentUserProfile &&
        room &&
        currentUserProfile.uid === room.user_ID ? (
          <AudioSettings
            room={room}
            currentAudioChannel={currentAudioChannel}
          />
        ) : null}
      </div>

      {/** This is the admin info/settings tile*/}
      {(room && room.associate) ||
      (currentUserProfile &&
        room &&
        currentUserProfile.uid === room.user_ID) ? (
        <div
          className={
            currentUserProfile &&
            room &&
            currentUserProfile.uid === room.user_ID
              ? "single-room__container-admin--owner"
              : isMobile
              ? "single-room__container-admin--visitor"
              : "single-room__container-admin--visitor tiny-margin-top"
          }
        >
          <Admin room={room} />
        </div>
      ) : null}

      {/** This is the room info tile*/}
      {room ? (
        <div
          className={
            (room && room.accepting_donations) ||
            (currentUserProfile &&
              room &&
              currentUserProfile.uid === room.user_ID)
              ? "single-room__container-info--with-donations"
              : "single-room__container-info--without-donations"
          }
        >
          <RoomInfo room={room} setRoom={setRoom} values={values} setValues={setValues} />
        </div>
      ) : null}

      {/** This is the comments tile*/}
      {room ? (
        <Comments
          values={values}
          setValues={setValues}
          comments={comments}
          setComments={setComments}
          room={room}
        />
      ) : null}
    </div>
  );
};

export default connect(null, {
  fetchSingleRoom,
  fetchRoomComments,
  updateRoom,
  newComment,
  newPortal,
  enterPortal,
  associateWithRoom,
  keepRoomListed,
})(SingleRoom);
