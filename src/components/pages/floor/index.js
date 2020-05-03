import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import ImageMapper from "react-image-mapper";
import updateSound from "../../../files/update.mp3";
import dubstepTrack from "../../../files/dubstep.mp3";
import houseTrack from "../../../files/house.mp3";
import hiphopTrack from "../../../files/hiphop.mp3";

import bgTrack from "../../../files/bg.mp3";

import history from "../../../history";

import { FloorContext } from "../../../providers/Floor";
import { fetchCurrentFloor, fetchFloorRooms } from "../../../actions";
import { titleToKey } from "../../../utils/strings";
import { Howl, Howler } from "howler";
import FloorRoom from "../singleRoom/floorRoom";
import { AuthContext } from "../../../providers/Auth";

const dub = new Howl({
  src: [dubstepTrack],
});

const house = new Howl({
  src: [houseTrack],
});

const hiphop = new Howl({
  src: [hiphopTrack],
});

// const bgSound = new Howl({
//   src: [bgTrack],
//   loop: true,
//   volume: 1,
//   onend: function () {
//     console.log("Finished!");
//   },
//   onplay: () => {
//     console.log("starting!");
//   },
// });

const Floor = ({ match, currentFloor, fetchCurrentFloor }) => {
  const myHistory = useHistory(history);

  const { currentUserProfile } = useContext(AuthContext);

  const { globalFloor, setGlobalFloor, setGlobalFloorRoom } = useContext(FloorContext);
  const [isOwner, setIsOwner] = useState(false);

  const [room, setRoom] = useState(null);

  useEffect(() => {
    setIsOwner(
      currentUserProfile && globalFloor && currentUserProfile.uid === globalFloor.user_ID
    );
  }, [currentUserProfile, globalFloor]);

  const [values, setValues] = useState({
    hoveredArea: null,
    msg: null,
    moveMsg: null,
  });

  useEffect(() => {
    console.log("this flooor", currentFloor);
    !currentFloor ? fetchCurrentFloor(match.params.id) : setGlobalFloor(currentFloor);
  }, [match.params.id, currentFloor]);

  const playSound = (area) => {
    area > 7 ? dub.play() : area < 4 ? house.play() : hiphop.play();
  };

  const pauseSound = (area) => {
    area > 7 ? dub.stop() : area < 4 ? house.stop() : hiphop.stop();
  };

  const load = () => {
    setValues((val) => {
      return { ...val, msg: "Interact with image !" };
    });
  };

  const clicked = (area) => {
    // myHistory.push(`/floor/${globalFloor.id}/${titleToKey(area.name)}`);
    setRoom(area);
    setGlobalFloorRoom(area);
    pauseSound(
      Object.values(globalFloor.rooms)
        .map((ro) => ro.id)
        .indexOf(area.id)
    );
    // bgSound.stop();
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
    playSound(
      Object.values(globalFloor.rooms)
        .map((ro) => ro.id)
        .indexOf(area.id)
    );

    setValues((val) => {
      return { ...val, hoveredArea: area };
    });
  };

  const leaveArea = (area) => {
    pauseSound(
      Object.values(globalFloor.rooms)
        .map((ro) => ro.id)
        .indexOf(area.id)
    );
    setValues((val) => {
      return { ...val, hoveredArea: null };
    });
  };

  const getTipPosition = (area) => {
    return { top: `${area.center[1]}px`, left: `${area.center[0] + 200}px` };
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
          console.log("rooom", room);
        }}
        checked={!!room}
      />

      <div className="floor__room">
        {room ? (
          <FloorRoom
            floor={globalFloor}
            room={room}
            isOwner={isOwner}
            entityID={globalFloor.id + "-" + room.id}
          />
        ) : null}
      </div>

      {/* <div className="floor__navigation"> */}
      <div className="floor__video-overlay" />
      <img src="../../imgs/colors.jpg" className="floor__video-top" />
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
              areas: globalFloor && globalFloor.rooms ? Object.values(globalFloor.rooms) : [],
            }}
            width={1200}
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
      </div>
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
      {/* </div> */}
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
