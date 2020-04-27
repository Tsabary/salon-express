import "./styles.scss";
import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";

import firebase from "firebase/app";

import { togglePopup, detachListener } from "../../../actions";

import { PageContext } from "../../../providers/Page";
import { AuthContext } from "../../../providers/Auth";

import Explore from "../explore";
import Favorites from "../favorites";
import MyRooms from "../myRooms";

const Home = ({ popupShown, togglePopup, detachListener }) => {
  const { currentUser } = useContext(AuthContext);
  const { page, setPage } = useContext(PageContext);

  useEffect(() => {
    detachListener();
  });

  const renderContent = (p) => {
    switch (p) {
      case 1:
        return <Explore />;

      case 2:
        return <Favorites />;

      case 3:
        return <MyRooms />;

      default:
        return null;
    }
  };

  return (
    <div className="home">
      {!currentUser ? (
        <div className="home__welcome small-margin-bottom">
          Welcome to <span className="bold-700">Salon Express</span>, where you
          can discover public group video chats. Join sessions, and connect to
          other like minded people from around the world.{" "}
          <span
            className="bold-700"
            onClick={() => (window.location.hash = "sign-up")}
          >
            Sign Up
          </span>{" "}
          to join sessions - it's <span className="bold-700">FREE</span>.
        </div>
      ) : null}

      {currentUser ? (
        <div className="home__menu">
          <ul>
            {page === 1 && currentUser ? (
              <div className="default-active">Explore</div>
            ) : (
              <li
                onClick={() => {
                  setPage(1);
                  firebase
                    .analytics()
                    .logEvent("home_navigation", { feed: "Explore" });
                }}
              >
                <a href="#">Explore</a>
              </li>
            )}

            {page === 2 && currentUser ? (
              <div className="default-active">Favorites</div>
            ) : currentUser ? (
              <li
                onClick={() => {
                  setPage(2);
                  firebase
                    .analytics()
                    .logEvent("home_navigation", { feed: "Favorites" });
                }}
              >
                <a href="#">Favorites</a>
              </li>
            ) : null}

            {page === 3 && currentUser ? (
              <div className="default-active">My Rooms</div>
            ) : currentUser ? (
              <li
                onClick={() => {
                  setPage(3);
                  firebase
                    .analytics()
                    .logEvent("home_navigation", { feed: "My Rooms" });
                }}
              >
                <a href="#">My Rooms</a>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      {renderContent(page)}

      {/* NEW ROOM BUTTON */}
      {/* <a
        style={{ display: popupShown ? "none" : "" }}
        onClick={() => {
          togglePopup(true);
          firebase.analytics().logEvent("room_open_button_click");
        }}
        className="post-button"
        href={
          currentUser && currentUser.emailVerified ? "#add-room" : "#sign-up"
        }
      >
        New Room
      </a> */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    popupShown: state.popupShown,
  };
};

export default connect(mapStateToProps, { togglePopup, detachListener })(Home);
