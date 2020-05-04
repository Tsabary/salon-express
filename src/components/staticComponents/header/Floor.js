import "./styles.scss";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import firebase from "firebase/app";
import history from "../../../history";

import { AuthContext } from "../../../providers/Auth";
import { PageContext } from "../../../providers/Page";
import { FloorContext } from "../../../providers/Floor";

import { listenToProfile, stopListeningToProfile } from "../../../actions";

import AuthOptions from "./authOptions";
import UserOptions from "./userOptions";
import MobileMenu from "./mobileMenu";
import { connect } from "react-redux";

const FloorHeader = ({ listenToProfile, stopListeningToProfile }) => {
  const myHistory = useHistory(history);

  const { currentUser, setCurrentUserProfile } = useContext(AuthContext);
  const { page, setPage } = useContext(PageContext);
  const { floor } = useContext(FloorContext);

  useEffect(() => {
    if (currentUser) {
      listenToProfile(currentUser, setCurrentUserProfile);
    } else {
      stopListeningToProfile();
      setCurrentUserProfile(null);
    }
  }, [currentUser]);

  const handleChange = () => {
    setPage(1);
    myHistory.push(`/`);
  };

  const renderAuth = () => {
    switch (true) {
      case !!currentUser:
        return <UserOptions isFloor />;

      case !currentUser:
        return <AuthOptions />;
      default:
        return null;
    }
  };

  return (
    <div className="header">
      <MobileMenu />
      <div
        className={
          currentUser
            ? "header-with-logo header-with-logo--logged-in"
            : "header-with-logo header-with-logo--logged-out"
        }
      >
        <div className="header__logo-container">
          <div onClick={handleChange} className="header__title-full">
            <div className="header__title-main header__title-main--floor">Salon.</div>
            <div className="header__title-sub header__title-sub--floor">Humans Talking</div>

          </div>
          <div
            className="header__title header__title-lean"
            onClick={handleChange}
          >
            <div className="header__title-main ">S.</div>
          </div>
        </div>

        <div />
        <div />

        <div className="header__auth">{renderAuth()}</div>
      </div>

      <div className="header-without-logo">
        <div />
        <div />
        <div />
        <div className="header__auth">{renderAuth()}</div>
      </div>
    </div>
  );
};

export default connect(null, { listenToProfile, stopListeningToProfile })(
  FloorHeader
);
