import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import ImageMapper from "react-image-mapper";

import history from "../../../history";

import { FloorContext } from "../../../providers/Floor";
import { fetchFloor, fetchFloorRooms } from "../../../actions";
import { titleToKey } from "../../../utils/strings";

const Floor = ({ match, myFloors, fetchFloor }) => {
  const myHistory = useHistory(history);

  const { floor, setFloor } = useContext(FloorContext);

  const [values, setValues] = useState({
    hoveredArea: null,
    msg: null,
    moveMsg: null,
  });

  useEffect(() => {
    const thisFloor = myFloors.filter(
      (floor) => floor.id === match.params.id
    )[0];

    !thisFloor ? fetchFloor(match.params.id) : setFloor(thisFloor);
  }, [match.params.id, myFloors]);

  const load = () => {
    setValues((val) => {
      return { ...val, msg: "Interact with image !" };
    });
  };

  const clicked = (area) => {
    myHistory.push(`/floor/${floor.id}/${titleToKey(area.name)}`);

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
      {floor ? (
        <ImageMapper
          src={floor.image}
          map={{
            name: "my-map",
            areas: floor && floor.rooms ? Object.values(floor.rooms) : [],
          }}
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
      ) : null}
      {values.hoveredArea && (
        <span
          className="floor__tooltip"
          style={{ ...getTipPosition(values.hoveredArea) }}
        >
          {values.hoveredArea && values.hoveredArea.name}
        </span>
      )}
      {values.moveMsg ? values.moveMsg : null}
      {values.msg ? values.msg : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    myFloors: state.myFloors,
  };
};

export default connect(mapStateToProps, { fetchFloor, fetchFloorRooms })(Floor);
