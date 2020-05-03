import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

import { AuthContext } from "../../../../../providers/Auth";
import { UniqueIdContext } from "../../../../../providers/UniqueId";

import { titleToKey } from "../../../../../utils/strings";
import {
  listenToMultiverse,
  newPortal,
  leavePortal,
  detachListener,
  logGuestEntry,
  replaceTimestampWithUid,
} from "../../../../../actions";

import Portal from "./portal";
import InputField from "../../../../formComponents/inputField";

const Multiverse = ({
  entityID,
  room,
  currentPortal,
  setCurrentPortal,
  microphonePermissionGranted,
  cameraPermissionGranted,
  currentAudioChannel,
  listenToMultiverse,
  newPortal,
  leavePortal,
  detachListener,
  replaceTimestampWithUid,
  isFirstLoad,
  setIsFirstLoad,
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { uniqueId } = useContext(UniqueIdContext);

  const [portal, setPortal] = useState("");

  // This holdes the portal error if any (currently only one is "a portal with a similar name exists")
  const [portalError, setPortalError] = useState(null);
  const [userID, setUserID] = useState(null);

  // This is the multivers - a documents with info of all our portals
  const [multiverse, setMultiverse] = useState(null);

  // This is the same multiverse just as an array of objects rather as an object
  const [multiverseArray, setMultiverseArray] = useState(null) ;

  // We use this to filter portals by user text search
  const [query, setQuery] = useState("");

  // // This is our cleanup event for when the window closes ( remove the user from the portal)
  // useEffect(() => {
  //   const cleanup = () => {
  //     leavePortal(
  //       room,
  //       currentPortal,
  //       currentUserProfile && currentUserProfile.uid
  //         ? [currentUserProfile.uid, uniqueId]
  //         : [uniqueId]
  //     );
  //     detachListener();
  //   };

  //   window.addEventListener("beforeunload", cleanup);

  //   return () => {
  //     window.removeEventListener("beforeunload", cleanup);
  //   };
  // }, [room, currentUserProfile, currentPortal, uniqueId]);

  // This is our cleanup event for when the comonent unloads ( remove the user from the portal)
  useEffect(() => {
    listenToMultiverse(entityID, setMultiverse, setMultiverseArray, () => {
      newPortal(
        "Home",
        currentPortal,
        entityID,
        currentUserProfile && currentUserProfile.uid
          ? currentUserProfile.uid
          : uniqueId,
        (portalObj) => {
          setPortal("");
          setCurrentPortal(portalObj);
        }
      );
    });
    const myCleanup = () => {
      leavePortal(
        entityID,
        currentPortal,
        currentUserProfile && currentUserProfile.uid
          ? [currentUserProfile.uid, uniqueId]
          : [uniqueId]
      );
      detachListener();
    };

    window.addEventListener("beforeunload", myCleanup);

    return function cleanup() {
      if (!room || !currentPortal) return;
      myCleanup();
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [room, currentUserProfile, currentPortal, uniqueId]);

  // If it's not the first load or if we don't have anything in the multiverse array then return, because we either don't need to automatically pick the portal (not the first load) or there is no portal to choose
  useEffect(() => {
    if (!isFirstLoad || !multiverseArray || !multiverseArray.length) return;
    {
      setCurrentPortal(multiverseArray[0]);
      setIsFirstLoad(false);
    }
  }, [multiverseArray]);

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
        replaceTimestampWithUid(room, currentPortal, userID, uniqueId);
        setUserID(null);
      }
  }, [currentUserProfile, room, currentPortal]);

  // Render the portals to the page
  const renderPortals = (multiverse, query) => {
    return multiverse
      .filter(
        (el) =>
          el.title && el.title.toLowerCase().startsWith(query.toLowerCase())
      )
      .map((portal) => {
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

  const addEmoji = (emo) => {
    console.log("what is", emo);
  };

  return (
    <div
      className={
        currentAudioChannel
          ? "media__multiverse--with-audio section__container"
          : "media__multiverse--no-audio section__container"
      }
    >
      <div className="section__title">The Multiverse</div>

      <form
        className="multiverse__form"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          if (!currentUserProfile || !portal || !portal.length) return;

          if (
            multiverse.hasOwnProperty(
              portal.trim().split(" ").join("").toLowerCase()
            )
          ) {
            setPortalError("A portal with that name already exists");
            return;
          }

          newPortal(
            portal,
            currentPortal,
            entityID,
            currentUserProfile.uid,
            (portalObj) => {
              setPortal("");
              setCurrentPortal(portalObj);
              setPortalError(null);
            }
          );
        }}
      >
        <InputField
          type="text"
          placeHolder="Open a portal"
          value={portal}
          onChange={(port) => {
            if (port.length < 30)
              setPortal(
                port
                  .replace(/^([^-]*-)|-/g, "$1")
                  .replace(/[^\p{L}\s\d-]+/gu, "")
              );
          }}
        />
        {/* <div className="multiverse__emoji">
          <div className="multiverse__emoji--current" />
        </div> */}

        {currentUserProfile ? (
          <div>
            <button
              type="submit"
              className="small-button single-room__comment--boxed"
            >
              Open
            </button>
          </div>
        ) : (
          <div
            className="small-button single-room__comment--boxed"
            onClick={() => (window.location.hash = "sign-up")}
          >
            Open
          </div>
        )}
      </form>
      {/* <div>
        <Picker
          set="apple"
          onSelect={addEmoji}
          title="Pick your emoji…"
          emoji="point_up"
          style={{ position: "absolute", bottom: "20px", right: "20px" }}
          i18n={{
            search: "Recherche",
            categories: {
              search: "Résultats de recherche",
              recent: "Récents",
            },
          }}
        />{" "}
      </div> */}

      {portalError ? (
        <div className="form-error tiny-margin-top">{portalError}</div>
      ) : null}

      <div className="extra-tiny-margin-top">
        <InputField
          type="text"
          placeHolder="Find a portal"
          value={query}
          onChange={setQuery}
        />
      </div>

      <div className="multiverse__channels">
        {multiverseArray ? renderPortals(multiverseArray, query) : null}
      </div>
    </div>
  );
};

export default connect(null, {
  listenToMultiverse,
  newPortal,
  leavePortal,
  detachListener,
  logGuestEntry,
  replaceTimestampWithUid,
})(Multiverse);