import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";

import firebase from "../../../../firebase";


import { fetchFirstPrivate, fetchMorePrivate } from "../../../../actions/feeds";
import { AuthContext } from "../../../../providers/Auth";
import { GlobalContext } from "../../../../providers/Global";
import { renderRooms } from "../utils";

const PrivateRooms = ({
  privateRooms,
  fetchFirstPrivate,
  fetchMorePrivate,
}) => {
  const {currentUser, currentUserProfile } = useContext(AuthContext);
  const { setIsNewRoomPublic,setIsMenuOpen } = useContext(GlobalContext);

  const [filteredPrivate, setFilteredPrivate] = useState([]);
  const [lastVisiblePrivate, setLastVisiblePrivate] = useState(null);
  const [reachedLastPrivate, setReachedLastPrivate] = useState(true);
  const [privateVisible, setPrivateVisible] = useState(10);
  const [privateRoomsSearch, setPrivateRoomsSearch] = useState("");

  useEffect(() => {
    if (!currentUserProfile) return;

    fetchFirstPrivate(
      setLastVisiblePrivate,
      setReachedLastPrivate,
      currentUserProfile.uid
    );
  }, [currentUserProfile, fetchFirstPrivate]);

  useEffect(() => {
    setFilteredPrivate(
      privateRooms.filter((r) =>
        r.name.toLowerCase().startsWith(privateRoomsSearch.toLowerCase())
      )
    );
  }, [privateRoomsSearch, privateRooms]);

  return (
    <div className="side-menu__section">
      <div className="side-menu__actions">
        <a
          className="side-menu__action"
          data-tip="newPrivateRoom"
          data-for="newPrivateRoom"
          onClick={() => {
            setIsNewRoomPublic(false);
            firebase.analytics().logEvent("room_open_button_click");
          }}
          href={
            currentUser && currentUser.emailVerified ? "#add-room" : "#sign-up"
          }
        >
          +
        </a>
        <ReactTooltip id="newPrivateRoom">
          <div
            dangerouslySetInnerHTML={{
              __html:
                "Click to open a private Room just for you and your friends",
            }}
          />
        </ReactTooltip>
      </div>
      <details open>
        <summary>Private Rooms</summary>

        <input
          className="side-menu__search extra-tiny-margin-top tiny-margin-bottom"
          type="text"
          placeholder="Find a Room"
          value={privateRoomsSearch}
          onChange={(e) => setPrivateRoomsSearch(e.target.value)}
        />

        {filteredPrivate.length ? (
          renderRooms(filteredPrivate.slice(0, privateVisible), setIsMenuOpen)
        ) : currentUserProfile ? (
          <div className="centered-text">
            Create your first private Room and invite your friends
          </div>
        ) : (
          <div className="centered-text">
            Login now and create your first private Room
          </div>
        )}

        {filteredPrivate.length > privateVisible ? (
          <div
            className="side-menu__show-more tiny-margin-top"
            onClick={() => setPrivateVisible(privateVisible + 10)}
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
      privateRooms: state.privateRooms,
    };
  };
  

export default connect(mapStateToProps, { fetchFirstPrivate, fetchMorePrivate })(
  PrivateRooms
);