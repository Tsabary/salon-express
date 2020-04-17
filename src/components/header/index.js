import "./styles.scss";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import history from "../../history";

import { AuthContext } from "../../providers/Auth";
import { PageContext } from "../../providers/Page";

import AuthOptions from "./authOptions";
import UserOptions from "./userOptions";
import FilterInput from "./filterInput";
import MobileMenu from "./mobileMenu";
import { SearchContext } from "../../providers/Search";

const Header = () => {
  const { currentUser } = useContext(AuthContext);
  const { page, setPage } = useContext(PageContext);
  const { setSearchTerm } = useContext(SearchContext);
  const myHistory = useHistory(history);

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
        return <div className="header__center">Favorites</div>;

      case 3:
        return <div className="header__center">My Rooms</div>;


      case 5:
        return <FilterInput />;

      default:
        return <div />;
    }
  };

  return (
    <div className="header">
      <MobileMenu />
      <div className="header-with-logo">
        <div className="header__logo-container">
          <div onClick={handleChange} className="header__title-full">
            <div className="header__title-main ">Salon.</div>
            <div className="header__title-sub">
              Humans Talking
            </div>
          </div>
          <div
            className="header__title header__title-lean"
            onClick={handleChange}
          >
            <div className="header__title-main ">S.</div>
          </div>
        </div>
        {page === 1 || page === 5 ? <FilterInput /> : <div />}
        {currentUser ? <div className="header__new-room boxed-button">New Room</div>: null}

        <div className="header__auth">{renderAuth()}</div>
      </div>

      <div className="header-without-logo">
        <div />
        {renderCenter(page)}
        {currentUser ? <div className="header__new-room boxed-button">New Room</div>: null}

        <div className="header__auth">{renderAuth()}</div>
      </div>
    </div>
  );
};

export default Header;
