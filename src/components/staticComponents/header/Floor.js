import "./styles.scss";
import React, { useContext, useEffect } from "react";

import { AuthContext } from "../../../providers/Auth";

import {
  listenToProfile,
  stopListeningToProfile,
} from "../../../actions/users";

import MobileMenu from "./mobileMenu";
import { connect } from "react-redux";
import FloorLogo from "./floorLogo";
import HeaderAuth from "./auth";

const FloorHeader = ({ listenToProfile, stopListeningToProfile }) => {
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

  return (
    <div className="header">
      <MobileMenu />
      <div className="header-with-logo">
        <FloorLogo />
        <div />
        <div />
        <HeaderAuth />
      </div>

      <div className="header-without-logo">
        <div />
        <FloorLogo />
        <div />
        <HeaderAuth />
      </div>
    </div>
  );
};

export default connect(null, { listenToProfile, stopListeningToProfile })(
  FloorHeader
);
