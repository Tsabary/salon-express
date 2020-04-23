import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../../providers/Auth";
import { UniqueIdContext } from "../../../../providers/UniqueId";

import { titleToKey } from "../../../../utils/strings";
import {
  newPortal,
  leavePortal,
  detachListener,
  logGuestEntry,
  replaceTimestampWithUid,
} from "../../../../actions";

import Portal from "./portal";
import InputField from "../../../formComponents/inputField";
import BoxedButton from "../../../formComponents/boxedButton";

const Multiverse = ({
  room,
  values,
  setValues,
  multiverse,
  currentPortal,
  setCurrentPortal,
  multiverseArray,
  isFirstLoad,
  microphonePermissionGranted,
  cameraPermissionGranted,
  currentAudioChannel,
  newPortal,
  leavePortal,
  detachListener,
  logGuestEntry,
  replaceTimestampWithUid,
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { uniqueId } = useContext(UniqueIdContext);

  // This holdes the portal error if any (currently only one is "a portal with a similar name exists")
  const [portalError, setPortalError] = useState(null);
  const [userID, setUserID] = useState(null);

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
  }, [room, currentUserProfile, currentPortal, uniqueId]);

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
  }, [room, currentUserProfile, currentPortal, uniqueId]);

  // Send the update to all followers that someone has entered the room. Only do it when isFirstLoad is false, becasue that's the indicatir they've actually entered the room
  useEffect(() => {
    if (isFirstLoad) return;
    logGuestEntry(room, currentUserProfile);
  }, [isFirstLoad]);

  // If we have a hold of the user's profile now, we should replace the fake uid we've used before with the real user uid
  useEffect(() => {
    if (microphonePermissionGranted && cameraPermissionGranted)
      if (
        currentUserProfile &&
        currentUserProfile.uid &&
        room &&
        room.id &&
        currentPortal
      ) {
        replaceTimestampWithUid(
          room,
          currentPortal,
          uniqueId,
          currentUserProfile.uid
        );
        setUserID(currentUserProfile.uid);
      } else if (room && currentPortal && userID && uniqueId) {
        console.log("mine", "I am replacing uid with fake");
        replaceTimestampWithUid(room, currentPortal, userID, uniqueId);
      }
  }, [currentUserProfile, room, currentPortal]);

  // Render the portals to the page
  const renderPortals = (multiverse) => {
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

  return (
    <div
      className={
        currentAudioChannel
          ? "single-room__container-multiverse--with-audio section__container"
          : "single-room__container-multiverse--no-audio section__container"
      }
    >
      <div className="section__title">The Multiverse</div>
      <form
        className="multiverse__form"
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
            if (portal.length < 30)
              setValues({
                ...values,
                portal: portal
                  .replace(/^([^-]*-)|-/g, "$1")
                  .replace(/[^\p{L}\s\d-]+/gu, ""),
              });
          }}
        />

        {currentUserProfile ? (
          <>
            <button
              type="submit"
              className="boxed-button single-room__comment--boxed"
            >
              Open
            </button>

            <button
              type="submit"
              className="text-button-mobile  single-room__comment--text"
            >
              Open
            </button>
          </>
        ) : (
          <a href="#sign-up" className="auth-options__box">
            <BoxedButton text="Open" />
          </a>
        )}
      </form>
      {portalError ? (
        <div className="form-error tiny-margin-top">{portalError}</div>
      ) : null}

      <div className="multiverse__channels">
        {multiverseArray ? renderPortals(multiverseArray) : null}
      </div>
    </div>
  );
};

export default connect(null, {
  newPortal,
  leavePortal,
  detachListener,
  logGuestEntry,
  replaceTimestampWithUid,
})(Multiverse);
