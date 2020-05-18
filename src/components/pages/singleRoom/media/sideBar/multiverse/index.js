import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import "emoji-mart/css/emoji-mart.css";
import { Emoji, Picker } from "emoji-mart";

import { AuthContext } from "../../../../../../providers/Auth";

import { titleToKey } from "../../../../../../utils/strings";
import { newPortal } from "../../../../../../actions/portals";

import Portal from "./portal";
import InputField from "../../../../../formComponents/inputField";

const Multiverse = ({
  entityID,
  currentPortal,
  setCurrentPortal,
  multiverse,
  multiverseArray,
  microphonePermissionGranted,
  cameraPermissionGranted,
  currentAudioChannel,
  newPortal,
  isFirstLoad,
  setIsFirstLoad,
}) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [newPortalValues, setNewPortalValues] = useState("");

  // This holdes the portal error if any (currently only one is "a portal with a similar name exists")
  const [portalError, setPortalError] = useState(null);

  // We use this to filter portals by user text search
  const [query, setQuery] = useState("");

  // If it's not the first load or if we don't have anything in the multiverse array then return, because we either don't need to automatically pick the portal (not the first load) or there is no portal to choose
  useEffect(() => {
    if (!isFirstLoad || !multiverseArray || !multiverseArray.length) return;
    {
      setCurrentPortal((val) => {
        return { new: multiverseArray[0], old: val ? val.new : null };
      });
      setIsFirstLoad(false);
    }
  }, [multiverseArray]);

  useEffect(() => {
    if (!currentUserProfile) return;
    setNewPortalValues({ ...newPortalValues, user_ID: currentUserProfile.uid });
  }, [currentUserProfile]);

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
            currentPortal={currentPortal}
            setCurrentPortal={setCurrentPortal}
            entityID={entityID}
            microphonePermissionGranted={microphonePermissionGranted}
            cameraPermissionGranted={cameraPermissionGranted}
            key={titleToKey(portal.title)}
          />
        );
      });
  };

  const addEmoji = (emo) => {
    setNewPortalValues({ ...newPortalValues, totem: emo });
  };

  return (
    <div className="multiverse section__container "
      // className={
      //   !currentAudioChannel ||
      //   (currentAudioChannel && !currentAudioChannel.source)
      //     ? "media__multiverse--no-audio section__container"
      //     : currentAudioChannel && currentAudioChannel.source === "mixlr"
      //     ? "media__multiverse--with-mixlr section__container"
      //     : "media__multiverse--with-video section__container"
      // }
    >
      {console.log(
        "check",
        !currentAudioChannel
          ? "1"
          : currentAudioChannel && currentAudioChannel.source === "mixlr"
          ? "2"
          : "3"
      )}
      <div className="section__title">The Multiverse</div>

      <form
        className="multiverse__form"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          if (
            !currentUserProfile ||
            (newPortalValues && !newPortalValues.title) ||
            !newPortalValues.title.length
          )
            return;

          if (
            multiverse.hasOwnProperty(
              newPortalValues.title.trim().split(" ").join("").toLowerCase()
            )
          ) {
            setPortalError("A portal with that name already exists");
            return;
          }

          newPortal(
            newPortalValues,
            currentPortal.new,
            entityID,
            currentUserProfile.uid,
            (portalObj) => {
              setNewPortalValues({});
              setCurrentPortal((val) => {
                return { new: portalObj, old: val.new };
              });
              setPortalError(null);
            }
          );
        }}
      >
        <InputField
          type="text"
          placeHolder="Open a portal"
          value={newPortalValues.title}
          onChange={(port) => {
            if (port.length < 30)
              setNewPortalValues({
                ...newPortalValues,
                title: port
                  .replace(/^([^-]*-)|-/g, "$1")
                  .replace(/[^\p{L}\s\d-]+/gu, ""),
              });
          }}
        />
        <div className="multiverse__emoji">
          {newPortalValues && newPortalValues.totem ? (
            <Emoji emoji={newPortalValues.totem} size={16} />
          ) : (
            <img
              className="multiverse__emoji--current"
              src="../../../imgs/emoji.png"
            />
          )}

          <div className="multiverse__emoji--picker">
            <Picker
              set="apple"
              onSelect={addEmoji}
              title="Pick your emoji…"
              emoji="point_up"
              i18n={{
                search: "Search",
                categories: {
                  search: "Search Results",
                  recent: "Recents",
                },
              }}
            />
          </div>
        </div>

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
  newPortal,
})(Multiverse);

// // This is our cleanup event for when the comonent unloads ( remove the user from the portal)
// useEffect(() => {
//   if (!currentPortal || !entityID) return;

//   enterPortal(
//     entityID,
//     currentPortal,
//     currentUserProfile && currentUserProfile.uid
//       ? currentUserProfile.uid
//       : uniqueId
//   );

//   const myCleanup = () => {
//     leavePortal(
//       entityID,
//       currentPortal,
//       currentUserProfile && currentUserProfile.uid
//         ? [currentUserProfile.uid, uniqueId]
//         : [uniqueId]
//     );
//   };

//   window.addEventListener("beforeunload", myCleanup);

//   return function cleanup() {
//     if (!entityID || !currentPortal) return;
//     myCleanup();
//     window.removeEventListener("beforeunload", cleanup);
//   };
// }, [entityID, currentPortal, currentUserProfile, uniqueId]);

// If we have a hold of the user's profile now, we should replace the fake uid we've used before with the real user uid
// useEffect(() => {
//   if (microphonePermissionGranted && cameraPermissionGranted)
//     if (
//       currentUserProfile &&
//       currentUserProfile.uid &&
//       room &&
//       room.id &&
//       currentPortal
//     ) {
//       replaceTimestampWithUid(
//         entityID,
//         currentPortal,
//         uniqueId,
//         currentUserProfile.uid
//       );
//       setUserID(currentUserProfile.uid);
//     } else if (room && currentPortal && userID && uniqueId) {
//       replaceTimestampWithUid(entityID, currentPortal, userID, uniqueId);
//       setUserID(null);
//     }
// }, [currentUserProfile, room, currentPortal]);
