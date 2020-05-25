import "./styles.scss";
import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import firebase from "../../../firebase";
import history from "../../../history";

import { GlobalContext } from "../../../providers/Global";
import { AuthContext } from "../../../providers/Auth";

import {
  fetchFirstPrivate,
  fetchMorePrivate,
  fetchFirstPublic,
  fetchMorePublic,
  fetchFirstFloors,
  fetchMoreFloors,
} from "../../../actions/feeds";
import { favoritesToMembers, adminsIdToMembers } from "../../../actions/rooms";
import { detachFloorListener } from "../../../actions/floors";
import { detachChannelListener } from "../../../actions/rooms";

import SidebarAuth from "./auth";
import MenuRoom from "./menuRoom";
import MenuFloor from "./menuFloor";
import SidebarFooter from "./footer";
import { FloorContext } from "../../../providers/Floor";
import { RoomContext } from "../../../providers/Room";

const SideMenu = ({
  privateRooms,
  publicRooms,
  floors,
  fetchFirstPrivate,
  fetchMorePrivate,
  fetchFirstPublic,
  fetchMorePublic,
  fetchFirstFloors,
  fetchMoreFloors,
  favoritesToMembers,
  adminsIdToMembers,
  detachFloorListener,
  detachChannelListener,
}) => {
  const myHistory = useHistory(history);

  const { isMenuOpen, setIsNewRoomPublic } = useContext(GlobalContext);
  const { currentUser, currentUserProfile } = useContext(AuthContext);
  const { globalFloor } = useContext(FloorContext);
  const { globalRoom } = useContext(RoomContext);

  const [privateRoomsSearch, setPrivateRoomsSearch] = useState("");
  const [publicRoomsSearch, setPublicRoomsSearch] = useState("");
  const [floorsSearch, setFloorsSearch] = useState("");

  const [filteredPrivate, setFilteredPrivate] = useState([]);
  const [filteredPublic, setFilteredPublic] = useState([]);
  const [filteredFloors, setFilteredFloors] = useState([]);

  const [privateVisible, setPrivateVisible] = useState(10);
  const [publicVisible, setPublicVisible] = useState(10);
  const [floorsVisible, setFloorsVisible] = useState(10);

  const [lastVisiblePrivate, setLastVisiblePrivate] = useState(null);
  const [lastVisiblePublic, setLastVisiblePublic] = useState(null);
  const [lastVisibleFloors, setLastVisibleFloors] = useState(null);

  const [reachedLastPrivate, setReachedLastPrivate] = useState(true);
  const [reachedLastPublic, setReachedLastPublic] = useState(true);
  const [reachedLastFloors, setReachedLastFloors] = useState(true);

  useEffect(() => {
    if (!globalFloor) detachFloorListener();
  }, [globalFloor]);

  useEffect(() => {
    if (!globalRoom) detachChannelListener();
  }, [globalRoom]);

  useEffect(() => {
    if (!currentUserProfile) return;
    fetchFirstPrivate(
      setLastVisiblePrivate,
      setReachedLastPrivate,
      currentUserProfile.uid
    );

    fetchFirstPublic(
      setLastVisiblePublic,
      setReachedLastPublic,
      currentUserProfile.uid
    );

    fetchFirstFloors(
      setLastVisibleFloors,
      setReachedLastFloors,
      currentUserProfile.uid
    );
  }, [
    currentUserProfile,
    fetchFirstPrivate,
    fetchFirstPublic,
    fetchFirstFloors,
  ]);

  useEffect(() => {
    setFilteredPrivate(
      privateRooms.filter((r) =>
        r.name.toLowerCase().startsWith(privateRoomsSearch.toLowerCase())
      )
    );
  }, [privateRoomsSearch, privateRooms]);

  useEffect(() => {
    setFilteredPublic(
      publicRooms.filter((r) =>
        r.name.toLowerCase().startsWith(publicRoomsSearch.toLowerCase())
      )
    );
  }, [publicRoomsSearch, publicRooms]);

  useEffect(() => {
    setFilteredFloors(
      floors.filter((r) =>
        r.name.toLowerCase().startsWith(floorsSearch.toLowerCase())
      )
    );
  }, [floorsSearch, floors]);

  const renderRooms = (rooms) => {
    return rooms.map((ro) => {
      return <MenuRoom room={ro} key={ro.id} />;
    });
  };

  const renderFloors = (floors) => {
    return floors.map((fl) => {
      return <MenuFloor floor={fl} key={fl.id} />;
    });
  };

  return (
    <div className="side-menu">
      <div className="side-menu__separator" />
      <input
        type="checkbox"
        className="side-menu__checkbox"
        id="side-menu-toggle"
        checked={isMenuOpen}
        readOnly
      />
      <div className="side-menu__nav">
        <div className="side-menu__nav-content">
          <div>
            <div className="side-menu__section">
              <SidebarAuth />
            </div>
            <div className="side-menu__section">
              <div className="side-menu__actions">
                <a
                  className="side-menu__action"
                  onClick={() => {
                    setIsNewRoomPublic(false);
                    firebase.analytics().logEvent("room_open_button_click");
                  }}
                  href={
                    currentUser && currentUser.emailVerified
                      ? "#add-room"
                      : "#sign-up"
                  }
                >
                  +
                </a>
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

                {renderRooms(filteredPrivate.slice(0, privateVisible))}
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
            <div className="side-menu__section">
              <div className="side-menu__actions">
                <a
                  className="side-menu__action"
                  onClick={() => {
                    setIsNewRoomPublic(true);
                    firebase.analytics().logEvent("room_open_button_click");
                  }}
                  href={
                    currentUser && currentUser.emailVerified
                      ? "#add-room"
                      : "#sign-up"
                  }
                >
                  +
                </a>
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
                {renderRooms(filteredPublic.slice(0, publicVisible))}
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
            <div className="side-menu__section">
              <div className="side-menu__actions">
                <div
                  className="side-menu__action"
                  onClick={() => {
                    window.location.hash = "add-floor";
                    adminsIdToMembers();
                  }}
                >
                  +
                </div>
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

                {renderFloors(filteredFloors.slice(0, floorsVisible))}

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
          </div>
          <SidebarFooter />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    privateRooms: state.privateRooms,
    publicRooms: state.publicRooms,
    floors: state.floors,
  };
};

export default connect(mapStateToProps, {
  fetchFirstPrivate,
  fetchMorePrivate,
  fetchFirstPublic,
  fetchMorePublic,
  fetchFirstFloors,
  fetchMoreFloors,
  favoritesToMembers,
  adminsIdToMembers,
  detachFloorListener,
  detachChannelListener,
})(SideMenu);
