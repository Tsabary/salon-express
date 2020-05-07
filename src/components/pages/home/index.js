import "./styles.scss";
import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";

import firebase from "firebase/app";

import { detachListener } from "../../../actions";

import { PageContext } from "../../../providers/Page";
import { AuthContext } from "../../../providers/Auth";

import Explore from "./explore";
import Favorites from "./favorites";
import MyRooms from "./myRooms";
import Floors from "./floors";

const Home = ({ detachListener }) => {
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

      case 4:
        return <Floors />;

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

      <div className="home__menu">
        <ul>
          {page === 1 ? (
            <div className="default-active">Explore</div>
          ) : currentUser ? (
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
          ) : (
            <li
              onClick={() => {
                firebase.analytics().logEvent("home_navigation_unregistered", {
                  feed: "Explore",
                });
              }}
            >
              <a href="#sign-up">Explore</a>
            </li>
          )}

          {page === 2 ? (
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
          ) : (
            <li
              onClick={() => {
                firebase.analytics().logEvent("home_navigation_unregistered", {
                  feed: "Favorites",
                });
              }}
            >
              <a href="#sign-up">Favorites</a>
            </li>
          )}

          {page === 3 ? (
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
          ) : (
            <li
              onClick={() => {
                firebase.analytics().logEvent("home_navigation_unregistered", {
                  feed: "My Rooms",
                });
              }}
            >
              <a href="#sign-up">My Rooms</a>
            </li>
          )}

          {page === 4 ? (
            <div className="default-active">Floors</div>
          ) : (
            <li
              onClick={() => {
                setPage(4);
                firebase
                  .analytics()
                  .logEvent("home_navigation", { feed: "Floors" });
              }}
            >
              <a href="#">Floors</a>
            </li>
          )}
        </ul>
      </div>

      {renderContent(page)}
    </div>
  );
};

export default connect(null, { detachListener })(Home);
