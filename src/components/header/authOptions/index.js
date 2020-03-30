import "./styles.scss";
import React from "react";

import BoxedButton from "../../formComponents/boxedButton";

const AuthOptions = () => {
  return (
    <div className="auth-options">
      <a href="#sign-up">
        <BoxedButton text="Join" />
      </a>
    </div>
  );
};

export default AuthOptions;
