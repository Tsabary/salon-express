import "./styles.scss";
import React, { useState, useContext } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import history from "../../../../history";

import { AuthContext } from "../../../../providers/Auth";
import { PageContext } from "../../../../providers/Page";

import { logOut } from "../../../../actions/users";
import { turnToLowerCaseWithHyphen } from "../../../../utils/strings";

const Drawer = ({ logOut }) => {
  const { currentUserProfile } = useContext(AuthContext);
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

      case "Floors":
        console.log("item number", 4);
        return 4;

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

      <label className="navigation__nav" htmlFor="navi-toggle">
        <nav className="navigation__nav-menu" id="nav-menu">
          <div className="navigation__profile-container">
            <img
              className="navigation__profile-image"
              src={
                currentUserProfile && currentUserProfile.avatar
                  ? currentUserProfile.avatar
                  : "../imgs/avatar.png"
              }
              alt="Profile"
            />
            <div className="navigation__profile-name">
              {currentUserProfile && currentUserProfile.name}
            </div>
          </div>

          <ul className="navigation__list">
            {currentUserProfile && page
              ? renderMenuItems(
                  ["Explore", "Favorites", "My Rooms", "Floors"],
                  page
                )
              : renderMenuItems(["Explore"], page)}

            {currentUserProfile ? (
              <div
                onClick={() => {
                  setIsMenuOpen(false);
                  window.location.hash = "add-room";
                }}
              >
                <li className="navigation__item">New Room</li>
              </div>
            ) : null}

            {currentUserProfile ? (
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
            {currentUserProfile ? (
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
                    window.location.hash = "sign-up";
                  }}
                >
                  Sign Up / Login
                </div>
              </li>
            )}
          </ul>

          {/* <div className="navigation__event" onClick={()=>myHistory.push("/floor/inqlusiv")}>
            INQLUSIV
          </div> */}
        </nav>
      </label>
    </div>
  );
};

export default connect(null, { logOut })(Drawer);
