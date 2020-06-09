import "./styles.scss";
import React, { useState, useContext } from "react";
import { connect } from "react-redux";

import { logOut } from "../../../../actions/users";

import SignUpForm from "../../../forms/signUpForm";
import { AuthContext } from "../../../../providers/Auth";
import User from "../../../otherComponents/user/static";

const EmbedLogin = ({ logOut }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="embed-login hover-up">
      <input
        type="checkbox"
        className="embed-login__checkbox"
        id="embed-login__checkbox"
        checked={isAuthOpen}
        readOnly
      />
      <div className="embed-login__container">
        <div
          className="embed-login__logo clickable"
          onClick={() => setIsAuthOpen(true)}
        >
          S.
        </div>
        <div className="embed-login__hidden">
          {currentUserProfile ? (
            <div>
              <div className="fr-max">
                <div />
                <div
                  className="text-button-normal clickable tiny-margin-bottom"
                  onClick={() => setIsAuthOpen(false)}
                >
                  Close
                </div>
              </div>
              <User user={currentUserProfile} />
              <div className="fr-max">
                <div />
                <div className="text-button-normal" onClick={() => logOut()}>
                  Logout
                </div>
              </div>
              <div className="section__title tiny-margin-top">
                Powered by{" "}
                <a
                  className="text-button-normal"
                  href="https://salon.express"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Salon Express
                </a>
              </div>
            </div>
          ) : (
            <SignUpForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default connect(null, { logOut })(EmbedLogin);
