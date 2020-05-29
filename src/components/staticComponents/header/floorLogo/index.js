import "./styles.scss";
import React, { useContext } from "react";
import { FloorContext } from "../../../../providers/Floor";
import SalonLogo from "../salonLogo";

const FloorLogo = () => {
  const { globalFloor, globalFloorRoom, setGlobalFloorRoom } = useContext(
    FloorContext
  );

  return (
    <div className="floor-logo">
      {globalFloor && globalFloor.logo ? (
        <div>
          <img src={globalFloor.logo} className="floor__footer-logo" />
        </div>
      ) : (
        <div className="floor-logo__name">{globalFloor.name}</div>
      )}
    </div>
  );
};

export default FloorLogo;
