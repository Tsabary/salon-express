import "./styles.scss";
import React from "react";

import BoxedButton from "../../../formComponents/boxedButton";
import TextButton from "../../../formComponents/textButton";

const AuthOptions = () => {
  return (
    <div className="auth-options">
      <a href="#sign-up" className="auth-options__box">
        <BoxedButton text="Sign Up | Login" />
      </a>

      <a href="#sign-up" className="auth-options__text">
        <TextButton text="Sign Up | Login" />
      </a>
    </div>
  );
};

export default AuthOptions;
