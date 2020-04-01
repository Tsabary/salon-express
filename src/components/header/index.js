import "./styles.scss";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import history from "../../history";

import { setCurrentPage } from "../../actions";

import { AuthContext } from "../../providers/Auth";
import { PageContext } from "../../providers/Page";

import AuthOptions from "./authOptions";
import UserOptions from "./userOptions";
import FilterInput from "./filterInput";
import MobileMenu from "./mobileMenu";
import { SearchContext } from "../../providers/Search";

const Header = ({ setCurrentPage }) => {
  const { currentUser } = useContext(AuthContext);
  const { page, setPage } = useContext(PageContext);
  const { setSearchTerm} = useContext(SearchContext)
  const myHistory = useHistory(history);

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

  const handleChange = page => {
    setSearchTerm(null)
    setCurrentPage(page);
    setPage(1);
    myHistory.push(`/`);
  };

  const renderCenter = p => {
    switch (p) {
      case 1:
        return <FilterInput />;

      case 2:
        return <div className="header__center">Subscriptions</div>;

      case 3:
        return <div className="header__center">Calendar</div>;

      case 4:
        return <div className="header__center">My Channel</div>;

      case 5:
        return <FilterInput />;

      default:
        console.log("defff")
        return <div />;
    }
  };

  return (
    <div className="header">
      <MobileMenu />
      <div className="header-with-logo">
        <div className="header__logo-container">
          <div
            className="header__title header__title-full"
            onClick={handleChange}
          >
            Salon.
          </div>
          <div
            className="header__title header__title-lean"
            onClick={handleChange}
          >
            S.
          </div>
        </div>
        {page === 1 ? <FilterInput /> : <div />}
        <div className="header__auth">{renderAuth()}</div>
      </div>

      <div className="header-without-logo">
        <div />
        {renderCenter(page)}

        <div className="header__auth">{renderAuth()}</div>
      </div>
    </div>
  );
};

export default connect(null, { setCurrentPage })(Header);
