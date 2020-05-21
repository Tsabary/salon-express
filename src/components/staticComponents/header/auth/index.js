import "./styles.scss";
import React, { useContext } from "react";

import UserOptions from "../userOptions";
import { AuthContext } from "../../../../providers/Auth";

const HeaderAuth = () => {
  const { currentUser } = useContext(AuthContext);

  const loginButton = () => {
    return (
      <div
        className="auth-options__box boxed-button"
        onClick={() => (window.location.hash = "sign-up")}
      >
        Sign Up | Login
      </div>
    );
  };

  const renderAuth = () => {
    switch (true) {
      case !!currentUser:
        return <UserOptions />;

      case !currentUser:
        return loginButton();
      default:
        return null;
    }
  };

  return <div className="header-auth">{renderAuth()}</div>;
};

export default HeaderAuth;
