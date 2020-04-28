import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";

import { FloorContext } from "../../../providers/Floor";

import ImageMapper from "react-image-mapper";

import { fetchFloor, fetchFloorRooms } from "../../../actions";

const Floor = ({ match, fetchFloor, fetchFloorRooms }) => {
  const { floor, setFloor, floorRooms, setFloorRooms } = useContext(
    FloorContext
  );

  const [values, setValues] = useState({
    hoveredArea: null,
    msg: null,
    moveMsg: null,
  });

  useEffect(() => {
    if (!floor) {
      fetchFloor(match.params.id, setFloor);
    }
    // if (!floorRooms) {
    //   fetchFloorRooms(match.params.id, setFloorRooms);
    // }
  }, [match]);

  // const URL = "https://c1.staticflickr.com/5/4052/4503898393_303cfbc9fd_b.jpg";
  const URL = "../../../imgs/floor_plan.jpg";

  const MAP = {
    name: "my-map",
    areas: [
      {
        name: "1",
        shape: "rect",
        coords: [640, 249, 1070, 458],
        preFillColor: "green",
        fillColor: "blue",
      },
      {
        name: "2",
        shape: "rect",
        coords: [254, 825, 466, 1106],
        preFillColor: "pink",
      },
      {
        name: "3",
        shape: "rect",
        coords: [758, 888, 1066, 1105, 800, 905],
        fillColor: "yellow",
      },
      {
        name: "4",
        shape: "rect",
        coords: [261, 169, 592, 352],
        preFillColor: "red",
      },
    ],
  };

  const load = () => {
    setValues((val) => {
      return { ...val, msg: "Interact with image !" };
    });
  };

  const clicked = (area) => {
    setValues((val) => {
      return {
        ...val,
        msg: `You clicked on ${area.shape} at coords ${JSON.stringify(
          area.coords
        )} !`,
      };
    });
  };

  const enterArea = (area) => {
    setValues((val) => {
      return { ...val, hoveredArea: area };
    });
  };

  const leaveArea = (area) => {
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
      <ImageMapper
        src={URL}
        map={{ name: "my-map", areas: floor && floor.rooms ? floor.rooms : [] }}
        width={700}
        imgWidth={1300}
        onLoad={() => load()}
        onClick={(area) => clicked(area)}
        onMouseEnter={(area) => enterArea(area)}
        onMouseLeave={(area) => leaveArea(area)}
        onMouseMove={(area, _, evt) => moveOnArea(area, evt)}
        onImageClick={(evt) => clickedOutside(evt)}
        onImageMouseMove={(evt) => moveOnImage(evt)}
      />
      {values.hoveredArea && (
        <span
          className="floor__tooltip"
          style={{ ...getTipPosition(values.hoveredArea) }}
        >
          {values.hoveredArea && values.hoveredArea.name}
        </span>
      )}
      {values.moveMsg ? values.moveMsg : null}
    </div>
  );
};

export default connect(null, { fetchFloor, fetchFloorRooms })(Floor);
