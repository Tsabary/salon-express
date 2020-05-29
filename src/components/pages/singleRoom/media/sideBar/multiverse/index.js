import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import "emoji-mart/css/emoji-mart.css";
import { Emoji, Picker } from "emoji-mart";
import ReactTooltip from "react-tooltip";
import AutosizeInput from "react-input-autosize";

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
  newPortal,
  isFirstLoad,
  setIsFirstLoad,
  isChatVisible,
  isVideoVisible,
}) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [newPortalValues, setNewPortalValues] = useState({});

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
    <div
    // className={
    //   isChatVisible && isVideoVisible
    //     ? " media-sidebar__multiverse section__container "
    //     : " media-sidebar__multiverse--lean section__container "
    // }
    className={
      isChatVisible && isVideoVisible
        ? "multiverse media-sidebar__multiverse section__container "
        : "multiverse media-sidebar__multiverse--lean section__container "
    }
    >
     <div className="max-max">
        <div className="section__title">The Multiverse</div>

        <>
          <div
            className="info"
            data-tip="multiverseInfo"
            data-for="multiverseInfo"
          />
          <ReactTooltip place="bottom" id="multiverseInfo">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '"The Multiverse" is where you can find all the portals for this room.',
              }}
            />
          </ReactTooltip>
        </> 
      </div>

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
        <div className="fr-max">
          <div className="multiverse__form-input-container">
            <div className="multiverse__emoji">
              {newPortalValues && newPortalValues.totem ? (
                <div className="extra-tiny-margin-top">
                  <Emoji emoji={newPortalValues.totem} size={16} />
                </div>
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

            <input
              className="multiverse__form-input"
              style={{ border: "none", outline: "none" }}
              id="Open a portal"
              type="text"
              placeholder="Open a portal"
              value={newPortalValues.title || ""}
              onChange={(e) => {
                if (e.target.value.length < 30)
                  setNewPortalValues({
                    ...newPortalValues,
                    title: e.target.value
                      .replace(/^([^-]*-)|-/g, "$1")
                      .replace(/[^\p{L}\s\d-]+/gu, ""),
                  });
              }}
            />
          </div>
          <div
            className="info extra-tiny-margin-top"
            data-tip="portalInfo"
            data-for="portalInfo"
          />
          <ReactTooltip place="bottom" id="portalInfo">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  'A "Portal" is a video chat. Every Portal you open is a seperate video chat to all the others.',
              }}
            />
          </ReactTooltip>
        </div>

        {currentUserProfile ? (
          <button type="submit" className="small-button">
            Open
          </button>
        ) : (
          <div
            className="small-button"
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
