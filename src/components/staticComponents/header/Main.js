import "./styles.scss";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import firebase from "firebase/app";
import history from "../../../history";

import { AuthContext } from "../../../providers/Auth";
import { PageContext } from "../../../providers/Page";
import { SearchContext } from "../../../providers/Search";

import {
  listenToProfile,
  stopListeningToProfile,
} from "../../../actions/users";

import FilterInput from "./filterInput";
import MobileDrawer from "./mobileDrawer";
import { connect } from "react-redux";
import SalonLogo from "./salonLogo";
import HeaderAuth from "./auth";

const Header = ({ listenToProfile, stopListeningToProfile }) => {
  const { currentUser, setCurrentUserProfile } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      listenToProfile(currentUser, setCurrentUserProfile);
    } else {
      stopListeningToProfile();
      setCurrentUserProfile(null);
    }

    return function cleanup() {
      stopListeningToProfile();
      setCurrentUserProfile(null);
    };
  }, [currentUser]);

  const renderNewRoomButton = () => {
    return (
      <a
        className="header__new-room boxed-button"
        onClick={() => {
          firebase.analytics().logEvent("room_open_button_click");
        }}
        href={
          currentUser && currentUser.emailVerified ? "#add-room" : "#sign-up"
        }
      >
        New Room
      </a>
    );
  };

  return (
    <div className="header">
      <MobileDrawer />

      <div className="header-with-logo">
        <SalonLogo />
        <FilterInput />
        {renderNewRoomButton()}
        <HeaderAuth />
      </div>

      <div className="header-without-logo">
        <div/>
        <FilterInput />
        {renderNewRoomButton()}
        <HeaderAuth />
      </div>
    </div>
  );
};

export default connect(null, { listenToProfile, stopListeningToProfile })(
  Header
);
