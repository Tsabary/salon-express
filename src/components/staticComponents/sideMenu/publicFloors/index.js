import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import ReactTooltip from "react-tooltip";

import history from "../../../../history";
import firebase from "../../../../firebase";

import {
  fetchFirstPublicFloors,
  fetchMorePublicFloors,
} from "../../../../actions/feeds";
import { AuthContext } from "../../../../providers/Auth";
import { GlobalContext } from "../../../../providers/Global";
import { renderFloors } from "../utils";

const PublicFloors = ({
  publicFloors,
  current,
  setCurrent,
  fetchFirstPublicFloors,
  fetchMorePublicFloors,
}) => {
  const myHistory = useHistory(history);

  const { currentUser, currentUserProfile } = useContext(AuthContext);
  const { setIsNewFloorPublic, setIsMenuOpen } = useContext(GlobalContext);

  const [floorsSearch, setFloorsSearch] = useState("");
  const [filteredFloors, setFilteredFloors] = useState([]);
  const [floorsVisible, setFloorsVisible] = useState(10);
  const [lastVisibleFloors, setLastVisibleFloors] = useState(null);
  const [reachedLastFloors, setReachedLastFloors] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!currentUserProfile) return;

    fetchFirstPublicFloors(
      setLastVisibleFloors,
      setReachedLastFloors,
      currentUserProfile.uid
    );
  }, [currentUserProfile, fetchFirstPublicFloors]);

  useEffect(() => {
    setFilteredFloors(
      publicFloors.filter((r) =>
        r.name.toLowerCase().startsWith(floorsSearch.toLowerCase())
      )
    );
  }, [floorsSearch, publicFloors]);

  return (
    <div className="side-menu__section">
      <div className="side-menu__actions">
        <div
          className="side-menu__action"
          data-tip="newPublicFloor"
          data-for="newPublicFloor"
          onClick={() => {
            window.location.hash = "add-floor";
            setIsNewFloorPublic(true);
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
      <details
        // open={current === 4}
        // onClick={() => {
        //   if (isOpen) {
        //     setIsOpen(false);
        //     setCurrent(0);
        //   } else {
        //     setIsOpen(true);
        //     setCurrent(4);
        //   }
        // }}
      >
        <summary>Public Floors</summary>

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
          renderFloors(filteredFloors.slice(0, floorsVisible), setIsMenuOpen)
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
    publicFloors: state.publicFloors,
  };
};

export default connect(mapStateToProps, {
  fetchFirstPublicFloors,
  fetchMorePublicFloors,
})(PublicFloors);
