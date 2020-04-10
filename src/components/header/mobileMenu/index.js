import "./styles.scss";
import React, { useState, useContext } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import history from "../../../history";

import { AuthContext } from "../../../providers/Auth";
import { PageContext } from "../../../providers/Page";

import { togglePopup, logOut } from "../../../actions";
import { turnToLowerCaseWithHyphen } from '../../../utils/strings';

const Menu = ({ togglePopup, logOut }) => {
  const { currentUser } = useContext(AuthContext);
  const { page, setPage } = useContext(PageContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const myHistory = useHistory(history);




  const itemNumber = item => {
    switch (item) {
      case "Explore":
        return 1;

      case "Subscriptions":
        return 2;

      case "Calendar":
        return 3;

      case "My Channel":
        return 4;
    }
  };

  const handleChange = p => {
    if (p !== page) setPage(p);
    p === 6 ? myHistory.push("/contact") : myHistory.push("/");

    setIsMenuOpen(false);
  };

  const renderMenuItems = (array, p) => {
    return array.map(item => {
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
          togglePopup();
        }}
      >
        <span className="navigation__icon">&nbsp;</span>
      </label>
      <div className="navigation__background">&nbsp;</div>

      <nav className="navigation__nav">
        <ul className="navigation__list">
          {currentUser && page
            ? renderMenuItems(
                ["Explore", "Subscriptions", "Calendar", "My Channel"],
                page
              )
            : renderMenuItems(["Explore"], page)}
          {currentUser ? (
            <a href="#update-profile" onClick={() => setIsMenuOpen(false)}>
              <li className="navigation__item">Update Profile</li>
            </a>
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
              <a
                className="navigation__item"
                href="#sign-up"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up / Login
              </a>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default connect(null, { togglePopup, logOut })(Menu);
