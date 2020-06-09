import "./styles.scss";
import React, { useEffect } from "react";

import ReactTooltip from "react-tooltip";

import MultiverseForm from "../multiverseForm";
import MultiversePortals from "../multiversePortals";

const Multiverse = ({
  entityID,
  currentPortal,
  setCurrentPortal,
  multiverse,
  multiverseArray,
  microphonePermissionGranted,
  cameraPermissionGranted,
  isFirstLoad,
  setIsFirstLoad,
  isChatVisible,
  isVideoVisible,
}) => {
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

  return (
    <div
      className={
        isChatVisible && isVideoVisible
          ? "multiverse media-sidebar__multiverse section__container "
          : "multiverse media-sidebar__multiverse--lean section__container "
      }
      style={{ height: "100%" }}
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

      <MultiverseForm
        entityID={entityID}
        multiverse={multiverse}
        currentPortal={currentPortal}
        setCurrentPortal={setCurrentPortal}
      />
      <div className="extra-tiny-margin-top" />
      <MultiversePortals
        entityID={entityID}
        currentPortal={currentPortal}
        setCurrentPortal={setCurrentPortal}
        multiverseArray={multiverseArray}
        microphonePermissionGranted={microphonePermissionGranted}
        cameraPermissionGranted={cameraPermissionGranted}
      />
    </div>
  );
};

export default Multiverse;

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
