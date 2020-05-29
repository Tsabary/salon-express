import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";
import { FloorContext } from "../../../providers/Floor";
import {
  fetchCurrentFloor,
  fetchFloorRooms,
  resetPublicAudioSettings,
  detachFloorListener,
  replaceFloorUids,
} from "../../../actions/floors";

import { detachCommentsListener } from "../../../actions/rooms";

import FloorRoom from "../singleRoom/floorRoom";
import Coming from "./coming";
import CurrentlyPlaying from "./currentlyPlaying";
import ImageMap from "./imageMap";
import { UniqueIdContext } from "../../../providers/UniqueId";
import FloorInfo from "./floorInfo";

const Floor = ({
  match,
  fetchCurrentFloor,
  resetPublicAudioSettings,
  detachFloorListener,
  detachCommentsListener,
  replaceFloorUids,
}) => {
  const { currentUser, currentUserProfile } = useContext(AuthContext);
  const { uniqueId } = useContext(UniqueIdContext);
  const { globalFloor, setGlobalFloor, globalFloorRoom } = useContext(
    FloorContext
  );

  const [isOwner, setIsOwner] = useState(false);
  const [openDate, setOpenDate] = useState(null);
  const [userID, setUserID] = useState(currentUser ? currentUser.uid : null);
  const [entityID, setEntityID] = useState(null);

  // useEffect(() => {
  //   console.log("entityID floor", entityID);
  // }, [entityID]);

  useEffect(() => {
    if (!globalFloor || !globalFloorRoom) return;
    setEntityID(globalFloor.id + "-" + globalFloorRoom.id);
  }, [globalFloor, globalFloorRoom]);

  useEffect(() => {
    if (!currentUserProfile || !globalFloor) return;
    console.log(
      "isOwner floor",
      currentUserProfile &&
        globalFloor &&
        globalFloor.admins_ID.includes(currentUserProfile.uid)
    );

    setIsOwner(
      currentUserProfile &&
        globalFloor &&
        globalFloor.admins_ID.includes(currentUserProfile.uid)
    );
  }, [currentUserProfile, globalFloor]);

  useEffect(() => {
    if (currentUser) {
      setUserID(currentUser.uid);
    }

    if (!globalFloor || !uniqueId) return;
    currentUser
      ? replaceFloorUids(globalFloor, uniqueId, currentUser.uid)
      : replaceFloorUids(globalFloor, userID, uniqueId);
  }, [currentUser, globalFloor, uniqueId]);

  useEffect(() => {
    setOpenDate(
      !globalFloor
        ? null
        : Object.prototype.toString.call(globalFloor.open) === "[object Date]"
        ? globalFloor.open
        : globalFloor.open.toDate()
    );
  }, [globalFloor]);

  useEffect(() => {
    resetPublicAudioSettings();

    fetchCurrentFloor(match.params.id, (fl) => {
      setGlobalFloor(fl);
    });

    const myCleanup = () => {
      detachFloorListener();
      detachCommentsListener();
    };

    window.addEventListener("beforeunload", myCleanup);

    return function cleanup() {
      myCleanup();
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [match.params.id]);

  return (
    <div className="floor">
      {openDate < new Date() || isOwner ? (
        <>
          <input
            className="floor__checkbox"
            type="checkbox"
            id="floor-room-checkbox"
            checked={!!globalFloorRoom}
            readOnly
          />

          {globalFloorRoom ? (
            <div className="floor__room">
              <FloorRoom isOwner={isOwner} entityID={entityID} />
            </div>
          ) : null}

          <div className="floor__body">
            <div className="floor__body-content">
              <FloorInfo floor={globalFloor} />
              <div className="floor__body-content--inner">
                <CurrentlyPlaying />
                <ImageMap />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="floor__body">
          <FloorInfo floor={globalFloor} />

          {openDate ? <Coming openDate={openDate} /> : null}
        </div>
      )}
    </div>
  );
};

export default connect(null, {
  fetchCurrentFloor,
  fetchFloorRooms,
  resetPublicAudioSettings,
  detachFloorListener,
  detachCommentsListener,
  replaceFloorUids,
})(Floor);
