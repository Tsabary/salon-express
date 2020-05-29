import "./styles.scss";
import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import firebase from "../../../firebase";
import history from "../../../history";

import { GlobalContext } from "../../../providers/Global";
import { AuthContext } from "../../../providers/Auth";

import { clearFeeds } from "../../../actions/feeds";
import {
  detachCommentsListener,
} from "../../../actions/rooms";
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

const SideMenu = ({
  detachFloorListener,
  detachChannelListener,
  detachCommentsListener,
  detachMultiverseListener,
  clearFeeds,
}) => {
  const { isMenuOpen } = useContext(GlobalContext);
  const { currentUserProfile } = useContext(AuthContext);
  const { globalFloor, globalFloorRoom } = useContext(FloorContext);
  const { globalRoom } = useContext(RoomContext);

  const [current, setCurrent] = useState(1)

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
            <div className="side-menu__section">
              <SidebarAuth />
            </div>
            <PrivateRooms current={current} setCurrent={setCurrent}  />
            <PublicRooms  current={current} setCurrent={setCurrent} />
            <PrivateFloors current={current} setCurrent={setCurrent}  />
            <PublicFloors  current={current} setCurrent={setCurrent} />
          </div>
          <SidebarFooter />
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
