import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import ReactTooltip from "react-tooltip";

import history from "../../../../history";
import firebase from "../../../../firebase";

import {
  fetchFirstPrivateFloors,
  fetchMorePrivateFloors,
} from "../../../../actions/feeds";
import { AuthContext } from "../../../../providers/Auth";
import { GlobalContext } from "../../../../providers/Global";
import { renderFloors } from "../utils";

const PrivateFloors = ({
  privateFloors,
  current,
  setCurrent,
  fetchFirstPrivateFloors,
  fetchMorePrivateFloors,
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

    fetchFirstPrivateFloors(
      setLastVisibleFloors,
      setReachedLastFloors,
      currentUserProfile.uid
    );
  }, [currentUserProfile, fetchFirstPrivateFloors]);

  useEffect(() => {
    setFilteredFloors(
      privateFloors.filter((r) =>
        r.name.toLowerCase().startsWith(floorsSearch.toLowerCase())
      )
    );
  }, [floorsSearch, privateFloors]);

  return (
    <div className="side-menu__section">
      <div className="side-menu__actions">
        <div
          className="side-menu__action"
          data-tip="newPublicFloor"
          data-for="newPublicFloor"
          onClick={() => {
            window.location.hash = "add-floor";
            setIsNewFloorPublic(false);
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
        // open={current === 3}
        // onClick={() => {
        //   if (isOpen) {
        //     setIsOpen(false);
        //     setCurrent(0);
        //   } else {
        //     setIsOpen(true);
        //     setCurrent(3);
        //   }
        // }}
      >
        <summary>Private Floors</summary>

        <input
          className="side-menu__search extra-tiny-margin-top tiny-margin-bottom"
          type="text"
          placeholder="Find a Floor"
          value={floorsSearch}
          onChange={(e) => setFloorsSearch(e.target.value)}
        />

        {filteredFloors.length ? (
          renderFloors(filteredFloors.slice(0, floorsVisible), setIsMenuOpen)
        ) : currentUserProfile ? (
          <div className="centered-text">
            Just like the button to create one, a private Floor is a plus
          </div>
        ) : (
          <div className="centered-text">
            Login now and create your first private Floor
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
    privateFloors: state.privateFloors,
  };
};

export default connect(mapStateToProps, {
  fetchFirstPrivateFloors,
  fetchMorePrivateFloors,
})(PrivateFloors);
