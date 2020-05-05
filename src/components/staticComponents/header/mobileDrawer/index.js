import "./styles.scss";
import React, { useState, useContext } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import history from "../../../../history";

import { AuthContext } from "../../../../providers/Auth";
import { PageContext } from "../../../../providers/Page";

import { logOut } from "../../../../actions";
import { turnToLowerCaseWithHyphen } from "../../../../utils/strings";

const Drawer = ({ logOut }) => {
  const { currentUser } = useContext(AuthContext);
  const { page, setPage } = useContext(PageContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const myHistory = useHistory(history);

  const itemNumber = (item) => {
    switch (item) {
      case "Explore":
        return 1;

      case "Favorites":
        return 2;

      case "My Rooms":
        return 3;

      default:
        return null;
    }
  };

  const handleChange = (p) => {
    if (p !== page) setPage(p);
    p === 6 ? myHistory.push("/contact") : myHistory.push("/");

    setIsMenuOpen(false);
  };

  const renderMenuItems = (array, p) => {
    return array.map((item) => {
      const smallHyphenedItem = turnToLowerCaseWithHyphen(item);

      return (
        <li className="navigation__item" key={item}>
          <input
            className="navigation__radio"
            id={smallHyphenedItem}
            type="radio"
            name="menu-items"
            checked={itemNumber(item) === p}
            readOnly
          />
          <label
            htmlFor={smallHyphenedItem}
            className="navigation__link"
            onClick={() => handleChange(itemNumber(item))}
          >
            {item}
          </label>
        </li>
      );
    });
  };

  return (
    <div className="navigation">
      <input
        type="checkbox"
        className="navigation__checkbox"
        id="navi-toggle"
        checked={isMenuOpen}
        readOnly
      />
      <label
        htmlFor="navi-toggle"
        className="navigation__button"
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
        }}
      >
        <span className="navigation__icon">&nbsp;</span>
      </label>
      <div className="navigation__background">&nbsp;</div>

      <label htmlFor="navi-toggle" className="navigation__nav">
        <nav className="navigation__nav-menu" id="nav-menu">
          {/* <ul className="navigation__list">
          {currentUser && page
            ? renderMenuItems(["Explore", "Favorites", "My Rooms"], page)
            : renderMenuItems(["Explore"], page)}

          {currentUser ? (
            <div
              onClick={() => {
                setIsMenuOpen(false);
                window.location.hash = "add-room";
              }}
            >
              <li className="navigation__item">New Room</li>
            </div>
          ) : null}

          {currentUser ? (
            <div
              onClick={() => {
                setIsMenuOpen(false);
                window.location.hash = "update-profile";
              }}
            >
              <li className="navigation__item">Update Profile</li>
            </div>
          ) : null}
          <li className="navigation__item" onClick={() => handleChange(6)}>
            Contact
          </li>
          {currentUser ? (
            <li
              className="navigation__item"
              onClick={() => {
                logOut();
                setIsMenuOpen(false);
              }}
            >
              Logout
            </li>
          ) : (
            <li>
              <div
                className="navigation__item"
                onClick={() => {
                  setIsMenuOpen(false);
                  window.location.hash="sign-up"
                }}
              >
                Sign Up / Login
              </div>
            </li>
          )}
        </ul>
      */}
        </nav>
      </label>
    </div>
  );
};

export default connect(null, { logOut })(Drawer);
