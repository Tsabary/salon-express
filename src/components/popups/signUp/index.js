import "./styles.scss";
import React from "react";

import SignUpForm from "../../forms/signUpForm";

const SignUp = () => {
  return (
    <div className="popup" id="sign-up">
      <div className="popup__close">
        <div />
        <div
          className="popup__close-text"
          onClick={() => {
            window.location.hash = "";
          }}
        >
          Close
        </div>
      </div>
      <SignUpForm />
    </div>
  );
};

export default SignUp;
