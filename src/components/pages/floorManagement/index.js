import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";

import { fetchMyFloors } from "../../../actions/floors";
import SingleFloor from "./singleFloor";

const FloorManagement = ({ fetchMyFloors }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const [floors, setFloors] = useState(null);

  useEffect(() => {
    if (currentUserProfile && !floors)
    fetchMyFloors(currentUserProfile, (data) => setFloors(data));
  }, [currentUserProfile]);

  const renderTitles = () => {
    const titles = [
      "Name",
      "No. of Rooms",
      "Tags",
      "Language",
      "Status",
      "Actions",
    ];

    return titles.map((title) => {
      return (
        <div className="floor-management__col-title" key={title}>
          {title}
        </div>
      );
    });
  };

  const renderFloors = (floors) => {
    return floors.map((floor) => {
      return <SingleFloor key={floor.id} floor={floor} />;
    });
  };

  return (
    <div className="floor-management">
      <div className="fr-max-max">
        <div className="floor-management__title">Your Floors</div>
        <div
          className="small-button clickable"
          onClick={() => {
            window.location.hash = "add-floor-plan";
          }}
        >
          New Floor Plan
        </div>

        {/* <div
          className="small-button clickable"
          onClick={() => {
            window.location.hash = "add-floor";
          }}
        >
          New Floor
        </div> */}
      </div>
      <div className="floor-management__table">
        <div className="floor-management__col-titles">{renderTitles()}</div>
        {floors ? (
          <div className="floor-management__floors">{renderFloors(floors)}</div>
        ) : null}
      </div>
    </div>
  );
};

export default connect(null, { fetchMyFloors })(FloorManagement);
