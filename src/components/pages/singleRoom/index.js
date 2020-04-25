import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { isMobile } from "react-device-detect";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
import MobileMultiverse from "./mobileMultiverse";
import Chat from "./chat";
import Youtube from "./youtube";
import Mixlr from "./mixlr";
import Twitch from "./twitch";

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

  const [mediaState, setMediaState] = useState(false);

  useEffect(() => {
    if (currentAudioChannel && currentAudioChannel.source) setMediaState(true);
  }, [currentAudioChannel]);

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

  const renderControllers = () => {
    return (
      <div className="single-room__media__buttons">
        {mediaState ? (
          <label
            className="single-room__media__button single-room__media__button--unactive"
            htmlFor="single-room-media-checkbox"
          >
            Chat
          </label>
        ) : (
          <div className="single-room__media__button single-room__media__button--active">
            Chat
          </div>
        )}

        {!mediaState ? (
          <label
            className="single-room__media__button single-room__media__button--unactive"
            htmlFor="single-room-media-checkbox"
          >
            Stream
          </label>
        ) : (
          <div className="single-room__media__button single-room__media__button--active">
            Stream
          </div>
        )}
      </div>
    );
  };

  // Our main render
  return (
    <div className="single-room">
      {/* {!cameraPermissionGranted || !microphonePermissionGranted ? <div className="single-room__point-bg"></div>:null} */}

      {isMobile ? (
        <MobileMultiverse room={room} multiverseArray={multiverseArray} />
      ) : null}

      {isMobile ? (
        <div className="single-room__container-no-mobile">
          To join the party on mobile, you will need the Jitsi app. Choose a
          portal from the multiverse to join.
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
      <div className="single-room__container-chat">
        <div className="single-room__media">
          <input
            className="single-room__media-checkbox"
            type="checkbox"
            id="single-room-media-checkbox"
            onChange={() => {
              setMediaState(!mediaState);
            }}
            checked={mediaState}
          />
          <div className="single-room__media__container">
            <span className="single-room__media__container__visible">
              {/* <div>{microphonePermissionGranted ? "happy" : "Sad"} {cameraPermissionGranted ? "happy" : "Sad"}</div> */}
              <Chat
                room={room}
                currentPortalUrl={currentPortalUrl}
                cameraPermissionGranted={cameraPermissionGranted}
                setCameraPermissionGranted={setCameraPermissionGranted}
                microphonePermissionGranted={microphonePermissionGranted}
                setMicrophonePermissionGranted={setMicrophonePermissionGranted}
              />
            </span>
            {currentAudioChannel && currentAudioChannel.source === "youtube" ? (
              <span className="single-room__media__container__hidden">
                <Youtube ID={currentAudioChannel.link} />
              </span>
            ) : null}

            {currentAudioChannel && currentAudioChannel.source === "twitch" ? (
              <span className="single-room__media__container__hidden">
                <Twitch ID={currentAudioChannel.link} />
              </span>
            ) : null}
          </div>

          {currentAudioChannel &&
          ["youtube", "twitch"].includes(currentAudioChannel.source)
            ? renderControllers()
            : null}

          {currentAudioChannel && ["youtube", "twitch"].includes(currentAudioChannel.source) ? (
            <div className="single-room__container-no-mobile">
              Please listen to the music using a headset, or disable your
              microphone in the chat to prevent noise for the other participants
            </div>
          ) : null}
        </div>
      </div>

      {/** This is the audio stream controller, if audio is being streamed*/}
      {currentAudioChannel && currentAudioChannel.source === "mixlr" ? (
        <Mixlr ID={currentAudioChannel.link} />
      ) : null}

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
          <RoomInfo
            room={room}
            setRoom={setRoom}
            values={values}
            setValues={setValues}
          />
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
