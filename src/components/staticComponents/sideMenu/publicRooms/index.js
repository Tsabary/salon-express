import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import ReactTooltip from "react-tooltip";

import history from "../../../../history";
import firebase from "../../../../firebase";

import { fetchFirstPublic, fetchMorePublic } from "../../../../actions/feeds";
import { AuthContext } from "../../../../providers/Auth";
import { GlobalContext } from "../../../../providers/Global";
import { renderRooms } from "../utils";


const PublicRooms = ({ publicRooms, fetchFirstPublic, fetchMorePublic }) => {
    const myHistory = useHistory(history);

  const { currentUser, currentUserProfile } = useContext(AuthContext);
  const { setIsNewRoomPublic, setIsMenuOpen } = useContext(GlobalContext);

  const [publicRoomsSearch, setPublicRoomsSearch] = useState("");
  const [filteredPublic, setFilteredPublic] = useState([]);
  const [publicVisible, setPublicVisible] = useState(10);
  const [lastVisiblePublic, setLastVisiblePublic] = useState(null);
  const [reachedLastPublic, setReachedLastPublic] = useState(true);

  useEffect(() => {
    if (!currentUserProfile) return;

    fetchFirstPublic(
      setLastVisiblePublic,
      setReachedLastPublic,
      currentUserProfile.uid
    );
  }, [currentUserProfile, fetchFirstPublic]);

  useEffect(() => {
    setFilteredPublic(
      publicRooms.filter((r) =>
        r.name.toLowerCase().startsWith(publicRoomsSearch.toLowerCase())
      )
    );
  }, [publicRoomsSearch, publicRooms]);

  return (
    <div className="side-menu__section">
      <div className="side-menu__actions">
        <a
          className="side-menu__action"
          data-tip="newPublicRoom"
          data-for="newPublicRoom"
          onClick={() => {
            setIsNewRoomPublic(true);
            firebase.analytics().logEvent("room_open_button_click");
          }}
          href={
            currentUser && currentUser.emailVerified ? "#add-room" : "#sign-up"
          }
        >
          +
        </a>
        <ReactTooltip id="newPublicRoom">
          <div
            dangerouslySetInnerHTML={{
              __html: "Click to open a public Room for your new community",
            }}
          />
        </ReactTooltip>
      </div>

      <details>
        <summary>Public Rooms</summary>
        <div className="fr-max">
          <input
            className="side-menu__search extra-tiny-margin-top tiny-margin-bottom"
            type="text"
            placeholder="Find a Room"
            value={publicRoomsSearch}
            onChange={(e) => setPublicRoomsSearch(e.target.value)}
          />
          <div
            className="side-menu__action side-menu__action--text extra-tiny-margin-bottom"
            onClick={() => myHistory.push("/explore")}
          >
            Explore
          </div>
        </div>
        {filteredPublic.length ? (
          renderRooms(filteredPublic.slice(0, publicVisible))
        ) : currentUserProfile ? (
          <div className="centered-text">
            Click "Explore" and to join some great public Rooms
          </div>
        ) : (
          <div className="centered-text">
            Login now and create your first public Room
          </div>
        )}
        {filteredPublic.length > publicVisible ? (
          <div
            className="side-menu__show-more tiny-margin-top"
            onClick={() => {
              setPublicVisible(publicVisible + 10);
            }}
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
    publicRooms: state.publicRooms,
  };
};

export default connect(mapStateToProps, {fetchFirstPublic, fetchMorePublic})(PublicRooms);
