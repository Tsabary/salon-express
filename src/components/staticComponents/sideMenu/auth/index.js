import "./styles.scss";
import React, { useContext, useEffect } from "react";
import firebase from "../../../../firebase";

import { AuthContext } from "../../../../providers/Auth";
import { logOut } from "../../../../actions/users";
import {
  createUpdateInRooms,
  removeUpdateInRooms,
} from "../../../../actions/dangorous";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import history from "../../../../history";

import {
  listenToMyLoungeVisitors,
  detachMyLoungeListener,
} from "../../../../actions/rooms";
import { GlobalContext } from "../../../../providers/Global";

const SidebarAuth = ({
  logOut,
  listenToMyLoungeVisitors,
  detachMyLoungeListener,
}) => {
  const myHistory = useHistory(history);

  const { currentUserProfile } = useContext(AuthContext);
  const { setLoungeRequests, setIsMenuOpen } = useContext(GlobalContext);

  useEffect(() => {
    if (!currentUserProfile) return;

    listenToMyLoungeVisitors(`user-${currentUserProfile.uid}`, (reqs) => {
      setLoungeRequests(reqs);
    });

    return function cleanup() {
      detachMyLoungeListener();
    };
  });

  const userProfile = () => {
    return (
      <div className="max-fr">
        <div
          className="user-options__image-container clickable"
          onClick={() => {
            myHistory.push(`/${currentUserProfile.username}`);
            setIsMenuOpen(false);
          }}
        >
          <img
            className="user-options__image"
            src={
              currentUserProfile.avatar
                ? currentUserProfile.avatar
                : "../imgs/avatar.png"
            }
          />
        </div>
        <div>
          <div
            className="sidebar-auth__name clickable"
            onClick={() => myHistory.push(`/${currentUserProfile.username}`)}
          >
            {currentUserProfile.name
              ? currentUserProfile.name
              : currentUserProfile.email}
          </div>
          <div className="max-max">
            {/* <div
              className="side-menu__button"
              onClick={() => {
                window.location.hash = "update-profile";
                firebase.analytics().logEvent("profile_update_clicked");
              }}
            >
              Edit
            </div> */}
            <div className="side-menu__button" onClick={() => logOut()}>
              Logout
            </div>
          </div>
        </div>
      </div>
    );
  };

  const loginButton = () => {
    return (
      <div
        className="small-button"
        onClick={() => (window.location.hash = "sign-up")}
      >
        Sign Up | Login
      </div>
    );
  };

  return <div>{currentUserProfile ? userProfile() : loginButton()}</div>;
};

export default connect(null, {
  logOut,
  listenToMyLoungeVisitors,
  detachMyLoungeListener,
})(SidebarAuth);
