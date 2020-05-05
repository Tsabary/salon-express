import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";

import ImageMapper from "react-image-mapper";
import { Howl, Howler } from "howler";

import { AuthContext } from "../../../providers/Auth";
import { FloorContext } from "../../../providers/Floor";
import { fetchCurrentFloor, fetchFloorRooms } from "../../../actions";
import FloorRoom from "../singleRoom/floorRoom";

const Floor = ({ match, currentFloor, fetchCurrentFloor }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const {
    globalFloor,
    setGlobalFloor,
    globalFloorRoom,
    setGlobalFloorRoom,
  } = useContext(FloorContext);

  const [isOwner, setIsOwner] = useState(false);
  const [sound, setSound] = useState();

  useEffect(() => {
    setIsOwner(
      currentUserProfile &&
        globalFloor &&
        currentUserProfile.uid === globalFloor.user_ID
    );
  }, [currentUserProfile, globalFloor]);

  const [values, setValues] = useState({
    hoveredArea: null,
    msg: null,
    moveMsg: null,
  });

  useEffect(() => {
    !currentFloor
      ? fetchCurrentFloor(match.params.id)
      : setGlobalFloor(currentFloor);
  }, [match.params.id, currentFloor]);

  useEffect(() => {
    if (sound) sound.play();
  }, [sound]);

  const playSound = (area) => {
    if (!area.track) return;

    setSound(
      new Howl({
        src: [area.track.file],
      })
    );
  };

  const pauseSound = (s) => {
    s.stop();
  };

  const load = () => {
    setValues((val) => {
      return { ...val, msg: "Interact with image !" };
    });
  };

  const clicked = (area) => {
    setGlobalFloorRoom(area);
    pauseSound();
    setValues((val) => {
      return {
        ...val,
        msg: `You clicked on ${area.id} at coords ${JSON.stringify(
          area.coords
        )} !`,
      };
    });
  };

  const enterArea = (area) => {
    playSound(area);
    // playSound(
    //   Object.values(globalFloor.rooms)
    //     .map((ro) => ro.id)
    //     .indexOf(area.id)
    // );

    setValues((val) => {
      return { ...val, hoveredArea: area };
    });
  };

  const leaveArea = (area) => {
    pauseSound(sound);
    // pauseSound(
    //   Object.values(globalFloor.rooms)
    //     .map((ro) => ro.id)
    //     .indexOf(area.id)
    // );
    setValues((val) => {
      return { ...val, hoveredArea: null };
    });
  };

  const getTipPosition = (area) => {
    return { top: `${area.center[1]}px`, left: `${area.center[0]}px` };
  };

  const clickedOutside = (evt) => {
    const coords = { x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY };
    setValues((val) => {
      return {
        ...val,
        msg: `You clicked on the image at coords ${JSON.stringify(coords)} !`,
      };
    });
  };
  const moveOnImage = (evt) => {
    const coords = { x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY };
    setValues((val) => {
      return {
        ...val,
        moveMsg: `You moved on the image at coords ${JSON.stringify(coords)} !`,
      };
    });
  };

  const moveOnArea = (area, evt) => {
    const coords = { x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY };
    setValues((val) => {
      return {
        ...val,
        moveMsg: `You moved on ${area.shape} ${
          area.name
        } at coords ${JSON.stringify(coords)} !`,
      };
    });
  };

  return (
    <div className="floor">
      <input
        className="floor__checkbox"
        type="checkbox"
        id="floor-room-checkbox"
        onChange={() => {
          console.log("rooom", globalFloorRoom);
        }}
        checked={globalFloorRoom}
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

      {/* <div className="floor__navigation"> */}
      {/* <div className="floor__video-overlay" /> */}
      {/* <img src="../../imgs/colors.jpg" className="floor__video-top" /> */}
      {/* <img src="../../imgs/floorbg.jpg" className="floor__bgimg" /> */}

      {/* 
        <div className="floor__video">
          <video autoPlay muted loop>
            <source src="../../vids/bp.mp4" type="video/mp4" />
            <source src="../../vids/bp.webm" type="video/webm" />
          </video>
        </div> */}

      <div className="floor__map">
        {globalFloor ? (
          <ImageMapper
            src={globalFloor.image}
            map={{
              name: "my-map",
              areas:
                globalFloor && globalFloor.rooms
                  ? Object.values(globalFloor.rooms)
                  : [],
            }}
            width={800}
            imgWidth={1500}
            onLoad={() => load()}
            onClick={(area) => clicked(area)}
            onMouseEnter={(area) => enterArea(area)}
            onMouseLeave={(area) => leaveArea(area)}
            onMouseMove={(area, _, evt) => moveOnArea(area, evt)}
            onImageClick={(evt) => clickedOutside(evt)}
            onImageMouseMove={(evt) => moveOnImage(evt)}
          />
        ) : null}

        {values.hoveredArea && (
          <span
            className="floor__tooltip"
            style={{ ...getTipPosition(values.hoveredArea) }}
          >
            <div> {values.hoveredArea && values.hoveredArea.name}</div>
            <div className="tiny-margin-top">
              {values.hoveredArea && values.hoveredArea.description}
            </div>
          </span>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentFloor: state.currentFloor,
  };
};

export default connect(mapStateToProps, { fetchCurrentFloor, fetchFloorRooms })(
  Floor
);
