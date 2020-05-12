import "./styles.scss";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import firebase from "firebase/app";
import history from "../../../history";

import { AuthContext } from "../../../providers/Auth";
import { PageContext } from "../../../providers/Page";
import { SearchContext } from "../../../providers/Search";

import { listenToProfile, stopListeningToProfile } from "../../../actions/users";

import AuthOptions from "./authOptions";
import UserOptions from "./userOptions";
import FilterInput from "./filterInput";
import MobileDrawer from "./mobileDrawer";
import { connect } from "react-redux";

const Header = ({ listenToProfile, stopListeningToProfile }) => {
  const myHistory = useHistory(history);

  const { currentUser, setCurrentUserProfile } = useContext(AuthContext);
  const { page, setPage } = useContext(PageContext);
  const { setSearchTerm } = useContext(SearchContext);

  useEffect(() => {
    if (currentUser) {
      listenToProfile(currentUser, setCurrentUserProfile);
    } else {
      stopListeningToProfile();
      setCurrentUserProfile(null);
    }
  }, [currentUser]);

  const handleChange = () => {
    setSearchTerm(null);
    setPage(1);
    myHistory.push(`/`);
  };

  const renderAuth = () => {
    switch (true) {
      case !!currentUser:
        return <UserOptions />;

      case !currentUser:
        return <AuthOptions />;
      default:
        return null;
    }
  };

  const renderCenter = (p) => {
    switch (p) {
      case 1:
        return <FilterInput />;

      case 2:
        return <FilterInput />;
        return <div className="header__center">Favorites</div>;

      case 3:
        return <FilterInput />;
        return <div className="header__center">My Rooms</div>;

      case 5:
        return <FilterInput />;

      default:
        return <div />;
    }
  };

  return (
    <div className="header">
      <MobileDrawer />
      <div
        className={
          currentUser
            ? "header-with-logo header-with-logo--logged-in"
            : "header-with-logo header-with-logo--logged-out"
        }
      >
        <div className="header__logo-container">
          <div onClick={handleChange} className="header__title-full">
            <div className="header__title-main ">Salon.</div>
            <div className="header__title-sub">Humans Talking</div>
          </div>
          <div
            className="header__title header__title-lean"
            onClick={handleChange}
          >
            <div className="header__title-main ">S.</div>
          </div>
        </div>
        {renderCenter(page)}
        {currentUser ? (
          <a
            className="header__new-room boxed-button"
            onClick={() => {
              firebase.analytics().logEvent("room_open_button_click");
            }}
            href={
              currentUser && currentUser.emailVerified
                ? "#add-room"
                : "#sign-up"
            }
          >
            New Room
          </a>
        ) : null}

        <div className="header__auth">{renderAuth()}</div>
      </div>

      <div className="header-without-logo">
        <div />
        {renderCenter(page)}
        {currentUser ? (
          <a
            className="header__new-room boxed-button"
            onClick={() => {
              firebase.analytics().logEvent("room_open_button_click");
            }}
            href={
              currentUser && currentUser.emailVerified
                ? "#add-room"
                : "#sign-up"
            }
          >
            New Room
          </a>
        ) : null}

        <div className="header__auth">{renderAuth()}</div>
      </div>
    </div>
  );
};

export default connect(null, { listenToProfile, stopListeningToProfile })(
  Header
);
