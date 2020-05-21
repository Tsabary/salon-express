import "./styles.scss";
import React, { useState, useContext } from "react";
import { FloorContext } from "../../../../providers/Floor";
import Stage from "../../../pages/floor/currentlyPlaying/stage";

const Teleport = () => {
  const { globalFloor } = useContext(FloorContext);

  const [open, setOpen] = useState(false);

  const renderLineup = (rooms) => {
    return rooms.map((ro) => {
      return <Stage room={ro} key={ro.coords.join("")} />;
    });
  };

  return (
    <div className="updates">
      <input
        className="updates__checkbox"
        type="checkbox"
        id="teleport"
        onChange={() => setOpen(!open)}
      />
      <label className="max-max updates__top" htmlFor="teleport">
        <div className="updates__title">Teleport</div>
      </label>
      <div className="updates__container">
        <div
          className="fr-fr"
          style={{ padding: "10px", paddingBottom: "30px" }}
        >
          {globalFloor ? renderLineup(Object.values(globalFloor.rooms)) : null}
        </div>
      </div>
    </div>
  );
};

export default Teleport;
