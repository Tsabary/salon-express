import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { Emoji } from "emoji-mart";
import { UniqueIdContext } from "../../../../../../providers/UniqueId";
import { AuthContext } from "../../../../../../providers/Auth";
import { connect } from "react-redux";

import {
  enterPortal,
  leavePortal,
  replaceTimestampWithUid,
} from "../../../../../../actions";

const Portal = ({
  portal,
  currentPortal,
  setCurrentPortal,
  entityID,
  microphonePermissionGranted,
  cameraPermissionGranted,
  enterPortal,
  leavePortal,
  replaceTimestampWithUid,
}) => {
  // Here are out IDs: First is our logged in user, second is a random UUID that we use for identification untill the user loggs in and the third is the logged in user's ID. The reason we save the third, is so we have a hold of it to remove it when the user logs out.
  const { currentUser } = useContext(AuthContext);
  const { uniqueId } = useContext(UniqueIdContext);
  const [userID, setUserID] = useState(currentUser ? currentUser.uid : null);

  useEffect(() => {
    if (currentUser) {
      setUserID(currentUser.uid);
    }
  }, [currentUser]);

  // isCurrent determines whether this portal is the current portal
  const [isCurrent, setIsCurrent] = useState(false);
  // const [wasCurrent, setWasCurrent] = useState(false);

  // const [firstLoad, setFirstLoad] = useState(true);

  // useEffect(() => {
  //   console.log("portals", isCurrent);

  //   // console.log(
  //   //   "portals",
  //   //   `${portal.title} status- isCurrent ${isCurrent} | wascurrent ${wasCurrent}`
  //   // );

  //   switch (true) {
  //     case isCurrent:
  //       enterPortal(
  //         entityID,
  //         portal,
  //         currentUser && currentUser.uid ? currentUser.uid : uniqueId,
  //         () => {
  //           setWasCurrent(true);
  //         }
  //       );
  //       break;
  //   }
  //       // case !isCurrent:
  //       //   leavePortal(
  //       //     entityID,
  //       //     portal,
  //       //     userID ? [userID, uniqueId] : [uniqueId],
  //       //     () => {
  //       //       setWasCurrent(false);
  //       //     }
  //       //   );
  //       //   break;

  //       const myCleanup = () => {
  //         leavePortal(
  //           entityID,
  //           portal,
  //           userID ? [userID, uniqueId] : [uniqueId],
  //           () => {
  //             setWasCurrent(false);
  //           }
  //         );
  //       };

  //       window.addEventListener("beforeunload", myCleanup);

  //       return function cleanup() {
  //         myCleanup();
  //         window.removeEventListener("beforeunload", cleanup);
  //       };

  // }, [isCurrent, entityID, portal, userID, uniqueId]);

  useEffect(() => {
    if (
      !microphonePermissionGranted ||
      !cameraPermissionGranted ||
      !currentPortal
    )
      return;

    if (currentPortal.new.title === portal.title && !isCurrent) {
      console.log("portal", currentPortal);

      enterPortal(
        entityID,
        currentPortal,
        currentUser && currentUser.uid ? currentUser.uid : uniqueId
        // () => {
        //   setWasCurrent(true);
        // }
      );

      setIsCurrent(true);
    } else if (currentPortal.new.title !== portal.title && isCurrent) {
      setIsCurrent(false);
    }

    const myCleanup = () => {
      if (currentPortal.new.title === portal.title) {
        leavePortal(entityID, portal, userID ? [userID, uniqueId] : [uniqueId]);
      }
    };

    window.addEventListener("beforeunload", myCleanup);

    return function cleanup() {
      myCleanup();
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [currentPortal, microphonePermissionGranted, cameraPermissionGranted]);

  // Switching between the UUID we have for unlogged users and the uid of logged users, when user logs in or out
  // useEffect(() => {
  //   if (
  //     !microphonePermissionGranted ||
  //     !cameraPermissionGranted ||
  //     !entityID ||
  //     !portal ||
  //     !uniqueId
  //   )
  //     return;
  //   if (currentUser && currentUser.uid === userID) return;

  //   if (currentUser && currentUser.uid) {
  //     replaceTimestampWithUid(entityID, portal, uniqueId, currentUser.uid);
  //   } else {
  //     replaceTimestampWithUid(entityID, currentPortal, userID, uniqueId, () => {
  //       setUserID(null);
  //     });
  //   }
  // }, [
  //   currentUser,
  //   uniqueId,
  //   userID,
  //   entityID,
  //   portal,
  //   microphonePermissionGranted && cameraPermissionGranted,
  // ]);

  // This is our cleanup event for when the comonent unloads ( remove the user from the portal)
  // useEffect(() => {
  //   if (!isCurrent) return;

  //   const myCleanup = () => {
  //     leavePortal(
  //       entityID,
  //       portal,
  //       userID ? [userID, uniqueId] : [uniqueId],
  //       () => {
  //         setWasCurrent(false);
  //       }
  //     );
  //   };

  //   window.addEventListener("beforeunload", myCleanup);

  //   return function cleanup() {
  //     myCleanup();
  //     window.removeEventListener("beforeunload", cleanup);
  //   };
  // }, [entityID, portal, userID, uniqueId]);

  return (
    <div
      className="portal"
      onClick={() =>
        setCurrentPortal((val) => {
          return { new: portal, old: val.new };
        })
      }
    >
      <div className="portal__title-container">
        {portal.totem ? (
          <div className="multiverse__emoji">
            <Emoji emoji={portal.totem} size={16} />
          </div>
        ) : null}
        <div className={isCurrent ? "portal__title--current" : "portal__title"}>
          {portal.title}
        </div>
      </div>
      <div className="portal__members">{portal.members.length} members</div>
    </div>
  );
};

export default connect(null, {
  enterPortal,
  leavePortal,
  replaceTimestampWithUid,
})(Portal);

// This is our cleanup event for when the comonent unloads ( remove the user from the portal)
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

// This is our cleanup event for when the comonent unloads ( remove the user from the portal)
// useEffect(() => {
//   if (!currentPortal || !entityID) return;

//   const myCleanup = () => {

//   };

//   window.addEventListener("beforeunload", myCleanup);

//   return function cleanup() {
//     if (!entityID || !currentPortal) return;
//     myCleanup();
//     window.removeEventListener("beforeunload", cleanup);
//   };
// }, [entityID, currentPortal, currentUserProfile, uniqueId]);
