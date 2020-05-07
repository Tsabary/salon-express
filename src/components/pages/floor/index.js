import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";
import { FloorContext } from "../../../providers/Floor";
import { fetchCurrentFloor, fetchFloorRooms, resetPublicAudioSettings } from "../../../actions";

import FloorRoom from "../singleRoom/floorRoom";
import Coming from "./coming";
import CurrentlyPlaying from "./currentlyPlaying";
import ImageMap from "./imageMap";

const Floor = ({ match, currentFloor, fetchCurrentFloor, resetPublicAudioSettings }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { globalFloor, setGlobalFloor, globalFloorRoom } = useContext(
    FloorContext
  );

  const [isOwner, setIsOwner] = useState(false);

  const [openDate, setOpenDate] = useState(null);

  useEffect(() => {
    setIsOwner(
      currentUserProfile &&
        globalFloor &&
        globalFloor.admins.includes(currentUserProfile.email)
    );
  }, [currentUserProfile, globalFloor]);

  useEffect(() => {

    resetPublicAudioSettings()

    !currentFloor
      ? fetchCurrentFloor(match.params.id)
      : setGlobalFloor(currentFloor);

    setOpenDate(
      !currentFloor
        ? null
        : Object.prototype.toString.call(currentFloor.open) === "[object Date]"
        ? currentFloor.open
        : currentFloor.open.toDate()
    );
  }, [match.params.id, currentFloor]);

  return (
    <div className="floor">
      {/* {openDate < new Date() || isOwner ? ( */}
        <>
          <input
            className="floor__checkbox"
            type="checkbox"
            id="floor-room-checkbox"
            // onChange={() => {
            //   console.log("rooom", globalFloorRoom);
            // }}
            checked={!!globalFloorRoom}
            readOnly
          />

          <div className="floor__room">
            {globalFloorRoom ? (
              <FloorRoom
                floor={globalFloor}
                room={globalFloorRoom}
                isOwner={isOwner}
                entityID={globalFloor.id + "-" + globalFloorRoom.id}
              />
            ) : null}
          </div>

          <div className="floor__body">
            <div className="floor__body-content edit-floor__section">
              <CurrentlyPlaying />
              <ImageMap />
            </div>
          </div>
        </>
      {/* ) : (
        <div className="floor__body">
          <Coming openDate={openDate} />
        </div>
      )} */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentFloor: state.currentFloor,
  };
};

export default connect(mapStateToProps, { fetchCurrentFloor, fetchFloorRooms, resetPublicAudioSettings })(
  Floor
);

{
  /* <div className="floor__navigation"> */
}
{
  /* <div className="floor__video-overlay" /> */
}
{
  /* <img src="../../imgs/colors.jpg" className="floor__video-top" /> */
}
{
  /* <img src="../../imgs/floorbg.jpg" className="floor__bgimg" /> */
}

{
  /* 
        <div className="floor__video">
          <video autoPlay muted loop>
            <source src="../../vids/bp.mp4" type="video/mp4" />
            <source src="../../vids/bp.webm" type="video/webm" />
          </video>
        </div> */
}

// onLoad={() => load()}
// onMouseMove={(area, _, evt) => moveOnArea(area, evt)}
// onImageClick={(evt) => clickedOutside(evt)}
// onImageMouseMove={(evt) => moveOnImage(evt)}

// const clickedOutside = (evt) => {
//   const coords = { x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY };
//   setValues((val) => {
//     return {
//       ...val,
//       msg: `You clicked on the image at coords ${JSON.stringify(coords)} !`,
//     };
//   });
// };
// const moveOnImage = (evt) => {
//   const coords = { x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY };
//   setValues((val) => {
//     return {
//       ...val,
//       moveMsg: `You moved on the image at coords ${JSON.stringify(coords)} !`,
//     };
//   });
// };

// const moveOnArea = (area, evt) => {
//   const coords = { x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY };
//   setValues((val) => {
//     return {
//       ...val,
//       moveMsg: `You moved on ${area.shape} ${
//         area.name
//       } at coords ${JSON.stringify(coords)} !`,
//     };
//   });
// };

// const load = () => {
//   setValues((val) => {
//     return { ...val, msg: "Interact with image !" };
//   });
// };
