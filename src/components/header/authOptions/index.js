import "./styles.scss";
import React from "react";

import BoxedButton from "../../formComponents/boxedButton";
import TextButton from "../../formComponents/textButton";

const AuthOptions = () => {
  return (
    <div className="auth-options">
      <div className="auth-options__box">
        <a href="#sign-up">
          <BoxedButton text="Sign Up / Login" />
        </a>
      </div>

      <div className="auth-options__text">
        <a href="#sign-up">
          <TextButton text="Sign Up / Login" />
        </a>
      </div>
    </div>
  );
};

export default AuthOptions;
