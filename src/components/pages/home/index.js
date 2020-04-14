import "./styles.scss";
import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";

import { togglePopup } from "../../../actions";

import { PageContext } from "../../../providers/Page";
import { AuthContext } from "../../../providers/Auth";

import Explore from "../explore";
import Subscriptions from "../subscriptions";
import Calendar from "../calendar";
import Mine from "../mine";

const Home = ({ popupShown, togglePopup }) => {
  const { currentUser } = useContext(AuthContext);
  const { page, setPage } = useContext(PageContext);

  const renderContent = (p) => {
    switch (p) {
      case 1:
        return <Explore />;

      case 2:
        return <Subscriptions />;

      case 3:
        return <Calendar />;

      case 4:
        return <Mine />;
    }
  };

  return (
    <div className="home">
      {!currentUser ? (
        <div className="home__welcome">
          Welcome to <span className="bold-700">Class Express</span>, where you
          can discover group video language practice sessions. Join sessions,
          talk to other like minded people from around the world, and practice
          the language you're learning! -{" "}
          <a href="#sign-up" className="bold-700">
            Sign Up
          </a>{" "}
          to start practicing - it's <span className="bold-700">FREE</span>.
        </div>
      ) : null}

      {currentUser ? (
        <div className="home__menu">
          <ul>
            {page === 1  && currentUser ? (
              <div className="default-active">Explore</div>
            ) : (
              <li onClick={() => setPage(1)}>
                <a href="#">Explore</a>
              </li>
            )}

            {page === 2 && currentUser ? (
              <div className="default-active">Subscriptions</div>
            ) : currentUser ? (
              <li onClick={() => setPage(2)}>
                <a href="#">Subscriptions</a>
              </li>
            ) : null}

            {page === 3 && currentUser ? (
              <div className="default-active">Calendar</div>
            ) : currentUser ? (
              <li onClick={() => setPage(3)}>
                <a href="#">Calendar</a>
              </li>
            ) : null}

            {page === 4 && currentUser ? (
              <div className="default-active">My Streams</div>
            ) : currentUser ? (
              <li onClick={() => setPage(4)}>
                <a href="#">My Streams</a>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      {renderContent(page)}

      {/* NEW STREAM BUTTON */}
      <a
        style={{ display: popupShown ? "none" : "" }}
        onClick={() => togglePopup(true)}
        className="post-button"
        href={
          currentUser && currentUser.emailVerified ? "#add-stream" : "#sign-up"
        }
      >
        New Session
      </a>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    popupShown: state.popupShown,
  };
};

export default connect(mapStateToProps, { togglePopup })(Home);
