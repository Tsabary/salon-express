import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Iframe from "react-iframe";
import {isMobile} from 'react-device-detect';

import history from "../../../history";

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
} from "../../../actions";

import { titleToKey } from "../../../utils/strings";

import InputField from "../../formComponents/inputField";
import TextArea from "../../formComponents/textArea";
import ToggleField from "../../formComponents/toggleField";
import BoxedButton from "../../formComponents/boxedButton";

import Portal from "./portal";
import Room from "../../room";
import Comment from "./comment";
import Section from "./section";

const SingleRoom = ({
  match,
  fetchSingleRoom,
  fetchRoomComments,
  updateRoom,
  replaceTimestampWithUid,
  leavePortal,
  enterPortal,
  detachListener,
  newComment,
  newPortal,
  associateWithRoom,
  keepRoomListed,
}) => {
  const myHistory = useHistory(history);

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
  const [isDescriptionEdited, setIsDescriptionEdited] = useState(false);
  const [isAudioStreamEdited, setIsAudioStreamEdited] = useState(false);
  const [isDonationsUrlEdited, setIsDonationsUrlEdited] = useState(false);

  // We use this state to hold
  const [values, setValues] = useState({});

  // This holdes the portal error if any (currently only one is "a portal with a similar name exists")
  const [portalError, setPortalError] = useState(null);

  // This holdes the donations error if any ("Not a valid URL")
  const [donationsError, setDonationsError] = useState(null);

  // This holds the current portal were in (its title)
  const [currentPortal, setCurrentPortal] = useState(null);

  // This holds the url og the current portal (it's a mix of the portal's title with the room's ID)
  const [currentPortalUrl, setCurrentPortalUrl] = useState(null);

  // This keeps track if it's our first time loading. On our first load, we set the portal to the fullest one in our multiverse. After that it's up to the user to decide. It's important to have it because we set the portal when we get an update for the multiverse
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    console.log("mine", "current portal changed");
  }, [currentPortalUrl]);

  // This happens when the room first loads. We take the id of the room and also the fake uid (return if it's not set yet) and we fetch the rooms data. There's also a callback for creating a new portal called home in case there aren't any portals in this room yet
  useEffect(() => {
    if (!uniqueId) return;
    fetchSingleRoom(
      match.params.id,
      setRoom,
      setMultiverse,
      setMultiverseArray,
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
            setPortalError(null);
          }
        );
      }
    );
    fetchRoomComments(match.params.id, setComments);
  }, [match.params.id, uniqueId]);

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

  useEffect(() => {
    const cleanup = () => {
      leavePortal(
        room,
        currentPortal,
        currentUserProfile && currentUserProfile.uid
          ? currentUserProfile.uid
          : uniqueId
      );
      detachListener();
      console.log("mine", "doing detachment shit from window unloda");
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [isFirstLoad, currentUserProfile, currentPortal]);

  // This cleans up our listener and removes us from the latest portal we were in. Is this the right place?
  useEffect(() => {
    return function cleanup() {
      if (!room || !currentPortal) return;
      leavePortal(
        room,
        currentPortal,
        currentUserProfile && currentUserProfile.uid
          ? currentUserProfile.uid
          : uniqueId
      );
      // detachListener();
      console.log("mine", "doing detachment shit from use effect");
    };
  }, [isFirstLoad, currentUserProfile, currentPortal]);

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

  // Render the room info
  const renderContent = (room, currentUserProfile) => {
    switch (true) {
      case !room:
        return null;

      case room === "empty":
        return (
          <div className="empty-feed">
            {/* Looks like this room isn't available anymore! */}
          </div>
        );

      default:
        return (
          <Room
            room={room}
            currentUserProfile={
              currentUserProfile || { uid: "", following: [], followers: [] }
            }
            key={room.id}
          />
        );
    }
  };

  // Render the comments to the page
  const renderComments = (comments) => {
    return comments.map((com) => {
      return <Comment comment={com} key={com.id} />;
    });
  };

  // Render the portals to the page
  const renderPortals = (multiverse) => {
    console.log("mine", multiverse);
    return multiverse.map((portal) => {
      return (
        <Portal
          portal={portal}
          members={portal.members}
          currentPortal={currentPortal}
          setCurrentPortal={setCurrentPortal}
          key={titleToKey(portal.title)}
        />
      );
    });
  };

  // Our main render
  return (
    <div className="single-room">
      <div className="single-room__container-multiverse section__container tiny-margin-top">
        <div className="section__title">The Multiverse</div>
        <form
          className="single-room__multiverse-form"
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            if (
              !currentUserProfile ||
              !values ||
              !values.portal ||
              !values.portal.length
            )
              return;

            if (
              multiverse.hasOwnProperty(
                values.portal.trim().split(" ").join("").toLowerCase()
              )
            ) {
              setPortalError("A portal with that name already exists");
              return;
            }

            newPortal(
              values.portal,
              currentPortal,
              room,
              currentUserProfile.uid,
              (portalObj) => {
                setValues({ ...values, portal: "" });
                setCurrentPortal(portalObj);
                setPortalError(null);
              }
            );
          }}
        >
          <InputField
            type="text"
            placeHolder="Open a portal"
            value={values.portal}
            onChange={(portal) => {
              if (portal.length < 30) setValues({ ...values, portal });
            }}
          />

          {currentUserProfile ? (
            <>
              <button
                type="submit"
                className="boxed-button single-room__comment--boxed"
              >
                Open Portal
              </button>

              <button
                type="submit"
                className="text-button-mobile  single-room__comment--text"
              >
                Open Portal
              </button>
            </>
          ) : (
            <a href="#sign-up" className="auth-options__box">
              <BoxedButton text="Open Portal" />
            </a>
          )}
        </form>
        {portalError ? (
          <div className="form-error tiny-margin-top">{portalError}</div>
        ) : null}

        <div className="single-room__portals">
          {multiverseArray ? renderPortals(multiverseArray) : null}
        </div>
      </div>

      <div className="single-room__container-chat">
        {currentPortalUrl ? (
          <Iframe
            url={
              room ? "https://meet.jit.si/ClassExpress-" + currentPortalUrl : ""
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

      <div className="single-room__container-audio">
        {room && room.audio_live ? (
          <Iframe
            url={`https://mixlr.com/users/${room.audio_stream}/embed`}
            width="100%"
            height="180px"
            id="myId2"
            display="initial"
            position="relative"
            className="single-room__audio"
          />
        ) : null}
      </div>

      <div className="single-room__container-donations">
        <Section
          currentUserProfile={currentUserProfile}
          room={room}
          values={values}
          setValues={setValues}
          analyticsTag="audio live"
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

      {/* <div className="single-room__container-description">
        <Section
          currentUserProfile={currentUserProfile}
          room={room}
          values={values}
          setValues={setValues}
          analyticsTag="description"
          visibilityConditionField="description"
          field="description"
          title="Description"
          isInEditMode={isDescriptionEdited}
          setIsInEditMode={setIsDescriptionEdited}
          inputType="area"
          inputPlaceholder="Add a description for this room"
        />
      </div> */}

      <div className="single-room__container-mixlr">
        {currentUserProfile &&
        room &&
        currentUserProfile.uid === room.user_ID ? (
          <Section
            currentUserProfile={currentUserProfile}
            room={room}
            values={values}
            setValues={setValues}
            analyticsTag="audio live"
            visibilityConditionField="audio_live"
            field="audio_stream"
            title="Audio Stream"
            isInEditMode={isAudioStreamEdited}
            setIsInEditMode={setIsAudioStreamEdited}
            tooltipId="audioStream"
            tooltipText="Paste here your Mixlr ID only.<br />Click for more details."
            inputType="text"
            inputPlaceholder="Your Mixlr ID"
            toggleID="audioLive"
            toggleText="Currently streaming audio"
            toggleOn={() => {
              updateRoom(
                {
                  ...room,
                  audio_live: true,
                },
                "audio live",
                () => console.log("audio went live")
              );
            }}
            toggleOff={() => {
              updateRoom(
                {
                  ...room,
                  audio_live: false,
                },
                "audio offline",
                () => console.log("audio went offline")
              );
            }}
            toggleDefault="audio_live"
          />
        ) : null}
      </div>

      <div
        className={
          currentUserProfile && room && currentUserProfile.uid === room.user_ID
            ? "single-room__container-admin--owner"
            : "single-room__container-admin--visitor"
        }
      >
        {(room && room.associate) ||
        (currentUserProfile &&
          room &&
          currentUserProfile.uid === room.user_ID) ? (
          <div className="section__container">
            {currentUserProfile &&
            room &&
            currentUserProfile.uid === room.user_ID ? (
              <>
                <ToggleField
                  id="singleRoomListed"
                  text="Keep room public"
                  toggleOn={() => keepRoomListed(room, true)}
                  toggleOff={() => keepRoomListed(room, false)}
                  isChecked={room.listed}
                />
                <ToggleField
                  id="singleRoomAssociate"
                  text="Associate me with this Room"
                  toggleOn={() => associateWithRoom(room, true)}
                  toggleOff={() => associateWithRoom(room, false)}
                  isChecked={room.associate}
                />
              </>
            ) : null}

            {room && room.associate ? (
              <>
                <div className="single-room__founder-admin">Founded by:</div>

                <div
                  className="max-max"
                  onClick={() => myHistory.push(`/${room.user_username}`)}
                >
                  <img className="comment__avatar" src={room.user_avatar} />
                  <div className="comment__user-name">{room.user_name}</div>
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="single-room__container-info">
        {renderContent(room, currentUserProfile)}
      </div>

      <div className="single-room__container-comments single-room__comments">
        <form
          className="fr-max"
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            if (
              !currentUserProfile ||
              !values ||
              !values.comment.body ||
              !values.comment.body.length
            )
              return;
            newComment(values.comment, () => {
              setComments([
                {
                  ...values.comment,
                  created_on: new Date(),
                  id: Date.now(),
                },
                ...comments,
              ]);
              setValues({ comment: { ...values.comment, body: "" } });
            });
          }}
        >
          <TextArea
            type="text"
            placeHolder="Leave a comment"
            value={values && values.comment && values.comment.body}
            onChange={(body) => {
              if (body.length < 500)
                setValues({
                  ...values,
                  comment: { ...values.comment, body },
                });
            }}
          />
          {currentUserProfile ? (
            <>
              <button
                type="submit"
                className="boxed-button single-room__comment--boxed"
              >
                Comment
              </button>

              <button
                type="submit"
                className="text-button-mobile single-room__comment--text"
              >
                Comment
              </button>
            </>
          ) : (
            <>
              <a
                href="#sign-up"
                className="boxed-button single-room__comment--boxed"
              >
                Comment
              </a>

              <a
                href="#sign-up"
                className="text-button-mobile single-room__comment--text"
              >
                Comment
              </a>
            </>
          )}
        </form>
        {comments ? renderComments(comments) : null}
      </div>
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
})(SingleRoom);
