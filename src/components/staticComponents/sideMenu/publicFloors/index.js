import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import ReactTooltip from "react-tooltip";

import history from "../../../../history";
import firebase from "../../../../firebase";

import { fetchFirstFloors, fetchMoreFloors } from "../../../../actions/feeds";
import { AuthContext } from "../../../../providers/Auth";
import { GlobalContext } from "../../../../providers/Global";
import { renderFloors } from "../utils";

const PublicFloors = ({ floors, fetchFirstFloors, fetchMoreFloors }) => {
  const myHistory = useHistory(history);

  const { currentUser, currentUserProfile } = useContext(AuthContext);
  const { setIsNewRoomPublic, setIsMenuOpen } = useContext(GlobalContext);

  const [floorsSearch, setFloorsSearch] = useState("");
  const [filteredFloors, setFilteredFloors] = useState([]);
  const [floorsVisible, setFloorsVisible] = useState(10);
  const [lastVisibleFloors, setLastVisibleFloors] = useState(null);
  const [reachedLastFloors, setReachedLastFloors] = useState(true);

  useEffect(() => {
    if (!currentUserProfile) return;

    fetchFirstFloors(
      setLastVisibleFloors,
      setReachedLastFloors,
      currentUserProfile.uid
    );
  }, [currentUserProfile, fetchFirstFloors]);

  useEffect(() => {
    setFilteredFloors(
      floors.filter((r) =>
        r.name.toLowerCase().startsWith(floorsSearch.toLowerCase())
      )
    );
  }, [floorsSearch, floors]);

  return (
    <div className="side-menu__section">
      <div className="side-menu__actions">
        <div
          className="side-menu__action"
          data-tip="newPublicFloor"
          data-for="newPublicFloor"
          onClick={() => {
            window.location.hash = "add-floor";
          }}
        >
          +
        </div>
        <ReactTooltip id="newPublicFloor">
          <div
            dangerouslySetInnerHTML={{
              __html: "Click to open a new public Floor",
            }}
          />
        </ReactTooltip>
      </div>
      <details>
        <summary>Floors</summary>

        <div className="fr-max">
          <input
            className="side-menu__search extra-tiny-margin-top tiny-margin-bottom"
            type="text"
            placeholder="Find a Floor"
            value={floorsSearch}
            onChange={(e) => setFloorsSearch(e.target.value)}
          />
          <div
            className="side-menu__action side-menu__action--text extra-tiny-margin-bottom"
            onClick={() => myHistory.push("/explore-floors")}
          >
            Explore
          </div>
        </div>

        {filteredFloors.length ? (
          renderFloors(filteredFloors.slice(0, floorsVisible))
        ) : currentUserProfile ? (
          <div className="centered-text">
            Click "Explore" and to join some great public Floors
          </div>
        ) : (
          <div className="centered-text">
            Login now and create your first public Floor
          </div>
        )}

        {filteredFloors.length > floorsVisible ? (
          <div
            className="side-menu__show-more tiny-margin-top"
            onClick={() => setFloorsVisible(floorsVisible + 10)}
          >
            Show More..
          </div>
        ) : null}
      </details>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    floors: state.floors,
  };
};

export default connect(mapStateToProps, { fetchFirstFloors, fetchMoreFloors })(
  PublicFloors
);
