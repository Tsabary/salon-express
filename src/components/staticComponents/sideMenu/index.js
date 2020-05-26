import "./styles.scss";
import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import firebase from "../../../firebase";
import history from "../../../history";

import { GlobalContext } from "../../../providers/Global";
import { AuthContext } from "../../../providers/Auth";

import { clearFeeds } from "../../../actions/feeds";
import { favoritesToMembers, adminsIdToMembers } from "../../../actions/rooms";
import { detachFloorListener } from "../../../actions/floors";
import { detachChannelListener } from "../../../actions/rooms";

import SidebarAuth from "./auth";
import SidebarFooter from "./footer";
import { FloorContext } from "../../../providers/Floor";
import { RoomContext } from "../../../providers/Room";
import PrivateRooms from "./privateRooms";
import PublicRooms from "./publicRooms";
import PublicFloors from "./publicFloors";

const SideMenu = ({
  favoritesToMembers,
  adminsIdToMembers,
  detachFloorListener,
  detachChannelListener,
  clearFeeds,
}) => {
  const myHistory = useHistory(history);

  const { isMenuOpen } = useContext(GlobalContext);
  const { currentUserProfile } = useContext(AuthContext);
  const { globalFloor } = useContext(FloorContext);
  const { globalRoom } = useContext(RoomContext);

  useEffect(() => {
    if (!globalFloor) detachFloorListener();
  }, [globalFloor]);

  useEffect(() => {
    if (!globalRoom) detachChannelListener();
  }, [globalRoom]);

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
            <PrivateRooms />
            <PublicRooms />
            <PublicFloors />
          </div>
          <SidebarFooter />
        </div>
      </div>
    </div>
  );
};

export default connect(null, {
  favoritesToMembers,
  adminsIdToMembers,
  detachFloorListener,
  detachChannelListener,
  clearFeeds,
})(SideMenu);
