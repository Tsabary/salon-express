import "./styles.scss";
import React from "react";

import BoxedButton from "../../../formComponents/boxedButton";
import TextButton from "../../../formComponents/textButton";

const AuthOptions = () => {
  return (
    <div className="auth-options">
      <div className="auth-options__box" onClick={()=> window.location.hash="sign-up"}>
        <BoxedButton text="Sign Up | Login" />
      </div>

      <div className="auth-options__text" onClick={()=> window.location.hash="sign-up"}>
        <TextButton text="Sign Up | Login" />
      </div>
    </div>
  );
};

export default AuthOptions;
