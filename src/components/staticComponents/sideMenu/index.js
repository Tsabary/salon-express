import "./styles.scss";
import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import firebase from "../../../firebase";
import history from "../../../history";

import { GlobalContext } from "../../../providers/Global";
import { AuthContext } from "../../../providers/Auth";

import { clearFeeds } from "../../../actions/feeds";
import { detachCommentsListener } from "../../../actions/rooms";
import { detachFloorListener } from "../../../actions/floors";
import { detachChannelListener } from "../../../actions/rooms";

import SidebarAuth from "./auth";
import SidebarFooter from "./footer";
import { FloorContext } from "../../../providers/Floor";
import { RoomContext } from "../../../providers/Room";
import PrivateRooms from "./privateRooms";
import PublicRooms from "./publicRooms";
import PrivateFloors from "./privateFloors";
import PublicFloors from "./publicFloors";
import { detachMultiverseListener } from "../../../actions/portals";
import { ReactSVG } from "react-svg";
import ReactTooltip from "react-tooltip";

const SideMenu = ({
  detachFloorListener,
  detachChannelListener,
  detachCommentsListener,
  detachMultiverseListener,
  clearFeeds,
}) => {
  const { isMenuOpen, setIsMenuOpen } = useContext(GlobalContext);
  const { currentUserProfile } = useContext(AuthContext);
  const { globalFloor, globalFloorRoom } = useContext(FloorContext);
  const { globalRoom } = useContext(RoomContext);

  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (!globalFloor) detachFloorListener();
  }, [globalFloor]);

  useEffect(() => {
    if (!globalRoom) detachChannelListener();
  }, [globalRoom]);

  useEffect(() => {
    if (!globalRoom && !globalFloorRoom) {
      detachCommentsListener();
      detachMultiverseListener();
    }
  }, [globalRoom, globalFloorRoom]);

  useEffect(() => {
    if (!currentUserProfile) clearFeeds();
  }, [currentUserProfile]);

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
            <div
              className="side-menu__section clickable"
              onClick={() => setIsMenuOpen(false)}
              style={{ paddingTop: ".8rem",paddingBottom: ".8rem" }}
            >
              <div className="fr-max">
              <div>Minimize</div>
              <div>&larr;</div>
              </div>
              
            </div>
            <div className="side-menu__section">
              <SidebarAuth />
            </div>
            <PrivateRooms current={current} setCurrent={setCurrent} />
            <PublicRooms current={current} setCurrent={setCurrent} />
            <PrivateFloors current={current} setCurrent={setCurrent} />
            <PublicFloors current={current} setCurrent={setCurrent} />
          </div>
          <SidebarFooter />
        </div>
        <div className="side-menu__nav-content--minimized">
          <div className="extra-tiny-margin-top" />

          <div
            className="clickable"
            data-tip
            data-for="side-bar-private-room"
            onClick={() => setIsMenuOpen(true)}
          >
            <ReactSVG
              src={"../sidebarIcons/room_locked.svg"}
              wrapper="div"
              beforeInjection={(svg) => {
                svg.classList.add("svg-icon--normal");
              }}
            />
            <ReactTooltip id="side-bar-private-room" place="right">
              <div>Private Rooms</div>
            </ReactTooltip>
          </div>

          <div
            className="clickable"
            data-tip
            data-for="side-bar-public-room"
            onClick={() => setIsMenuOpen(true)}
          >
            <ReactSVG
              src={"../sidebarIcons/room.svg"}
              wrapper="div"
              beforeInjection={(svg) => {
                svg.classList.add("svg-icon--normal");
              }}
            />
            <ReactTooltip id="side-bar-public-room" place="right">
              <div>Public Rooms</div>
            </ReactTooltip>
          </div>

          <div
            className="clickable"
            data-tip
            data-for="side-bar-private-floor"
            onClick={() => setIsMenuOpen(true)}
          >
            <ReactSVG
              src={"../sidebarIcons/floor_locked.svg"}
              wrapper="div"
              beforeInjection={(svg) => {
                svg.classList.add("svg-icon--normal");
              }}
            />
            <ReactTooltip id="side-bar-private-floor" place="right">
              <div>Private Floors</div>
            </ReactTooltip>
          </div>

          <div
            className="clickable"
            data-tip
            data-for="side-bar-public-floor"
            onClick={() => setIsMenuOpen(true)}
          >
            <ReactSVG
              src={"../sidebarIcons/floor.svg"}
              wrapper="div"
              beforeInjection={(svg) => {
                svg.classList.add("svg-icon--normal");
              }}
            />
            <ReactTooltip id="side-bar-public-floor" place="right">
              <div>Public Floors</div>
            </ReactTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, {
  detachFloorListener,
  detachChannelListener,
  detachCommentsListener,
  detachMultiverseListener,
  clearFeeds,
})(SideMenu);
