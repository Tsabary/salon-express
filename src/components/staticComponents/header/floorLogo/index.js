import "./styles.scss";
import React, { useContext } from "react";
import { FloorContext } from "../../../../providers/Floor";
import SalonLogo from "../salonLogo";

const FloorLogo = () => {
  const { globalFloor, globalFloorRoom, setGlobalFloorRoom } = useContext(
    FloorContext
  );

  const handleChange = () => {
    setGlobalFloorRoom(null);
  };

  return (
    <div className="floor-logo">
      {globalFloorRoom ? (
        <div className="floor-logo__back" onClick={handleChange}>
          &larr; Back to all stages
        </div>
      ) : globalFloor && globalFloor.logo ? (
        <div onClick={handleChange}>
          <img src={globalFloor.logo} className="floor-logo__img" />
        </div>
      ) : (
        <SalonLogo floor />
      )}
    </div>
  );
};

export default FloorLogo;
