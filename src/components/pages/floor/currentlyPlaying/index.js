import "./styles.scss";
import React, { useContext } from "react";

import { FloorContext } from "../../../../providers/Floor";
import Stage from "./stage";

const CurrentlyPlaying = () => {
  const { globalFloor } = useContext(FloorContext);

  const renderLineup = (rooms) => {
    return rooms.map((ro) => {
      return <Stage room={ro} key={ro.coords.join("")} />;
    });
  };

  return (
    <div className="currently-playing">
      {globalFloor ? (
        <div className="currently-playing__title">Currently Live</div>
      ) : null}
      <div className="currently-playing__stages">
        {globalFloor ? renderLineup(Object.values(globalFloor.rooms)) : null}
      </div>
    </div>
  );
};

export default CurrentlyPlaying;
