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
  replaceTimestampWithUid,
  leavePortal,
  enterPortal,
  detachListener,
  logGuestEntry,
} from "../../../actions";

import { titleToKey } from "../../../utils/strings";

import Section from "./section";
import AudioSettings from "./audioSettings";
import RoomInfo from "./roomInfo";
import Comments from "./comments";
import Admin from "./admin";
import Multiverse from "./multiverse";

const SingleRoom = ({
  match,
  fetchSingleRoom,
  fetchRoomComments,
  updateRoom,
  replaceTimestampWithUid,
  leavePortal,
  enterPortal,
  detachListener,
  newPortal,
  logGuestEntry,
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

  // These are controllers for the different containers - do we show the static or the edit mode
  const [isDonationsUrlEdited, setIsDonationsUrlEdited] = useState(false);

  // We use this state to hold
  const [values, setValues] = useState({});

  // This holdes the donations error if any ("Not a valid URL")
  const [donationsError, setDonationsError] = useState(null);

  // This holds the current portal were in (its title)
  const [currentPortal, setCurrentPortal] = useState(null);

  // This holds the url og the current portal (it's a mix of the portal's title with the room's ID)
  const [currentPortalUrl, setCurrentPortalUrl] = useState(null);

  // This keeps track if it's our first time loading. On our first load, we set the portal to the fullest one in our multiverse. After that it's up to the user to decide. It's important to have it because we set the portal when we get an update for the multiverse
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [currentAudioChannel, setCurrentAudioChannel] = useState(null);

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


   // This is our cleanup event for when the window closes ( remove the user from the portal)
   useEffect(() => {
    const cleanup = () => {
      leavePortal(
        room,
        currentPortal,
        currentUserProfile && currentUserProfile.uid
          ? [currentUserProfile.uid, uniqueId]
          : [uniqueId]
      );
      detachListener();
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [isFirstLoad, currentUserProfile, currentPortal]);


  // This is our cleanup event for when the comonent unloads ( remove the user from the portal)
  useEffect(() => {
    return function cleanup() {
      if (!room || !currentPortal) return;
      leavePortal(
        room,
        currentPortal,
        currentUserProfile && currentUserProfile.uid
          ? [currentUserProfile.uid, uniqueId]
          : [uniqueId]
      );
    };
  }, [isFirstLoad, currentUserProfile, currentPortal]);


  // This sets the comment basic info, and the values of the different fields in our page to what they currently are (so that they'll be present in our edit components)
  useEffect(() => {
    if (!room || !currentUserProfile || !currentUserProfile.uid) return;

    setValues({
      comment: {
        user_ID: currentUserProfile.uid,
        user_name: currentUserProfile.name,
        user_username: currentUserProfile.username,
        user_avatar: currentUserProfile.avatar,
        room_ID: room.id,
      },
    });

    if (room.user_ID !== currentUserProfile.uid) return;

    if (room.description)
      setValues((val) => {
        return { ...val, description: room.description };
      });

    if (room.audio_stream)
      setValues((val) => {
        return { ...val, audio_stream: room.audio_stream };
      });

    if (room.donations_url)
      setValues((val) => {
        return { ...val, donations_url: room.donations_url };
      });
  }, [currentUserProfile, room]);


    // Send the update to all followers that someone has entered the room. Only do it when isFirstLoad is false, becasue that's the indicatir they've actually entered the room
    useEffect(() => {
      if (isFirstLoad) return;
      logGuestEntry(room, currentUserProfile);
    }, [isFirstLoad]);

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
    enterPortal(
      room,
      currentPortal,
      currentUserProfile && currentUserProfile.uid
        ? currentUserProfile.uid
        : uniqueId
    );
  }, [currentPortal, room]);

  // If we have a hold of the user's profile now, we should replace the fake uid we've used before with the real user uid
  useEffect(() => {
    if (
      !currentUserProfile ||
      !currentUserProfile.uid ||
      !room ||
      !currentPortal
    )
      return;

    replaceTimestampWithUid(
      room,
      currentPortal,
      uniqueId,
      currentUserProfile.uid
    );
  }, [currentUserProfile, room, currentPortal]);

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
        />
      ) : null}
      {/** This is the video chat*/}
      {!isMobile ? (
        <div className="single-room__container-chat">
          {currentPortalUrl && !isMobile ? (
            <Iframe
              url={
                room
                  ? "https://meet.jit.si/ClassExpress-" + currentPortalUrl
                  : ""
              }
              width="100%"
              height="450px"
              id="myId"
              display="initial"
              position="relative"
              allow="fullscreen; camera; microphone"
              className="single-room__chat"
            />
          ) : null}
        </div>
      ) : null}
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
          <Section
            currentUserProfile={currentUserProfile}
            room={room}
            values={values}
            setValues={setValues}
            analyticsTag="accepting donations"
            visibilityConditionField="accepting_donations"
            field="donations_url"
            title="Link for Donations"
            moreText={room && room.donations_info}
            isInEditMode={isDonationsUrlEdited}
            setIsInEditMode={setIsDonationsUrlEdited}
            tooltipId="acceptingDonationsTooltip"
            tooltipText="Accepting donations?<br />Drop your forwarding link here."
            inputType="text"
            inputPlaceholder="Link for donations"
            formError={donationsError}
            setFormError={setDonationsError}
            isUrl={true}
            toggleID="acceptingDonationsToggle"
            toggleText="Currently accepting donations"
            toggleOn={() =>
              updateRoom(
                {
                  ...room,
                  accepting_donations: true,
                },
                "Enabled donations",
                () => console.log("Enabled donations")
              )
            }
            toggleOff={() =>
              updateRoom(
                {
                  ...room,
                  accepting_donations: false,
                },
                "Dissabled donations",
                () => console.log("Dissabled donations")
              )
            }
            toggleDefault="accepting_donations"
          />
        </div>
      ) : null}

      {/** This is the audio settings tile, in case the user is the page's admin*/}
      <div
        className={
          isMobile
            ? "single-room__container-mixlr"
            : "single-room__container-mixlr tiny-margin-top"
        }
      >
        {currentUserProfile &&
        room &&
        currentUserProfile.uid === room.user_ID ? (
          <AudioSettings
            values={values}
            setValues={setValues}
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
      {room && currentUserProfile ? (
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
          <RoomInfo room={room} values={values} setValues={setValues} />
        </div>
      ) : null}

      {/** This is the comments tile*/}
      {room ? (
        <Comments
          values={values}
          setValues={setValues}
          comments={comments}
          setComments={setComments}
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
  replaceTimestampWithUid,
  detachListener,
  leavePortal,
  enterPortal,
  associateWithRoom,
  keepRoomListed,
  logGuestEntry,
})(SingleRoom);
