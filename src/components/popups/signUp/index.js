import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import history from "../../../history";
import firebase from "firebase/app";

import { signUp, providerSignIn, togglePopup } from "../../../actions";

import InputField from "../../formComponents/inputField";

const SignUp = ({ signUp, providerSignIn, togglePopup }) => {
  const myHistory = useHistory(history);

  const [values, setValues] = useState({});
  const [submitting, setSubmitting] = useState(0);
  const [formError, setFormError] = useState("");

  const handleChange = (page, path) => {
    firebase.analytics().logEvent("signup_navigation", { page });
    myHistory.push(`/${path}`);
    window.location.hash = "#";
    window.scrollTo(0, 0);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    window.scrollTo(0, 0);
    setSubmitting(1);
    signUp(values.email, values.password, setSubmitting, setFormError, () =>
      togglePopup(false)
    );
  };

  const renderContent = (state, error) => {
    switch (state) {
      case 0:
        return (
          <>
            <div className="popup__title small-margin-bottom">Join Us</div>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="fr-fr">
                <div className="tiny-margin-bottom">
                  <InputField
                    type="email"
                    placeHolder="Email address"
                    value={values.email}
                    onChange={(email) => setValues({ ...values, email })}
                  />
                </div>

                <div className="tiny-margin-bottom">
                  <InputField
                    type="password"
                    placeHolder="Password"
                    value={values.password}
                    onChange={(password) => setValues({ ...values, password })}
                  />
                </div>
              </div>

              {error ? (
                <div className="form-error tiny-margin-top">{formError}</div>
              ) : null}

              <button
                type="submit"
                className="auth__button auth__button--direct"
              >
                Sign up | Login
              </button>

              <div
                className="auth__button auth__button--google  tiny-margin-top"
                onClick={() => {
                  providerSignIn("google", () => {
                    togglePopup(false);
                    window.location.hash = "";
                  });
                }}
              >
                google
              </div>
              <div
                className="auth__button auth__button--facebook tiny-margin-top"
                onClick={() => {
                  providerSignIn("facebook", () => {
                    togglePopup(false);
                    window.location.hash = "";
                  });
                }}
              >
                facebook
              </div>
            </form>
            <div className="legal-notice">
              By joining you aggree to our{" "}
              <span
                className="legal-notice__link"
                onClick={() =>
                  handleChange("Terms and Conditions", "terms-and-conditions")
                }
              >
                Terms of Service
              </span>{" "}
              and{" "}
              <span
                className="legal-notice__link"
                onClick={() => handleChange("Privacy Policy", "privacy-policy")}
              >
                Privacy Policy
              </span>
            </div>
          </>
        );

      case 1:
        return (
          <div className="centered">
            <Loader type="Grid" color="#1472FF" height={100} width={100} />
          </div>
        );

      case 2:
        return <div>Please check your inbox for our verification email </div>;

      case 3:
        return <div>Welcome back!</div>;

      case 4:
        return (
          <div>Oops, we seem to be experiencing some issues at the moment</div>
        );

      case 5:
        return (
          <div>Oops, we seem to be experiencing some issues at the moment</div>
        );
    }
  };

  return (
    <div className="popup" id="sign-up">
      <div className="popup__close">
        <div />
        <div
          className="popup__close-text"
          onClick={() => {
            togglePopup(false);
            window.location.hash=""

          }}
        >
          Close
        </div>
      </div>
      {renderContent(submitting, formError)}
    </div>
  );
};

export default connect(null, { signUp, providerSignIn, togglePopup })(SignUp);
