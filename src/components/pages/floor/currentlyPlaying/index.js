import "./styles.scss";
import React, { useContext } from "react";

import { FloorContext } from "../../../../providers/Floor";
import Stage from "./stage";

const CurrentlyPlaying = () => {
  const { globalFloor } = useContext(FloorContext);

  const renderLineup = (floor) => {
    return Object.values(floor.rooms).map((ro) => {
      return <Stage room={ro} key={ro.coords.join("")} />;
    });
  };

  return (
    <div className="currently-playing">
      <div className="currently-playing__title">Currently Playing</div>
      {globalFloor ? renderLineup(globalFloor) : null}
    </div>
  );
};

export default CurrentlyPlaying;
