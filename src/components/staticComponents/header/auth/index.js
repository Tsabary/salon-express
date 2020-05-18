import './styles.scss';
import React, { useContext } from "react";

import AuthOptions from "../authOptions";
import UserOptions from "../userOptions";
import { AuthContext } from "../../../../providers/Auth";

const HeaderAuth = () => {

    const { currentUser } = useContext(AuthContext);


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

  return <div className="header-auth">{renderAuth()}</div>;
};

export default HeaderAuth;
