import "./styles.scss";
import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import history from "../../../history";
import firebase from "firebase/app";

import { signUp, providerSignIn, passwordReset } from "../../../actions";

import InputField from "../../formComponents/inputField";
import validator from "validator";

const SignUp = ({ signUp, providerSignIn, passwordReset }) => {
  const myHistory = useHistory(history);

  const [values, setValues] = useState({});
  const [submitting, setSubmitting] = useState(0);
  const [formError, setFormError] = useState("");

  const handleChange = (page, path) => {
    firebase.analytics().logEvent("signup_navigation", { page });
    myHistory.push(`/${path}`);
    window.location.hash = "";
    window.scrollTo(0, 0);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validator.isEmail(values.email)) {
      window.scrollTo(0, 0);
      setSubmitting(1);
      signUp(values.email, values.password, setSubmitting, setFormError, () =>
        console.log("sign up complete")
      );
    } else {
      setFormError("Please use a valid email address");
    }
  };

  const handleReset = (event) => {
    event.preventDefault();
    window.scrollTo(0, 0);
    if (validator.isEmail(values.email)) {
      passwordReset(values.email, setSubmitting);
    } else {
      setFormError("Please use a valid email address");
    }
  };

  const renderContent = (state, error) => {
    switch (state) {
      case 0:
        return (
          <div>
            <div className="popup__title small-margin-bottom">Join Us</div>

            <div className="sign-up__toggle">
              <input
                className="sign-up-checkbox"
                type="checkbox"
                id="sign-up-checkbox"
              />
              <span className="sign-up__toggle--visible">
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
                        onChange={(password) =>
                          setValues({ ...values, password })
                        }
                      />
                    </div>
                  </div>

                  {error ? (
                    <div className="form-error tiny-margin-top">
                      {formError}
                    </div>
                  ) : null}
                  <label
                    className="sign-up__forgot-password"
                    htmlFor="sign-up-checkbox"
                  >
                    I forgot my password
                  </label>

                  <button
                    type="submit"
                    className="auth__button auth__button--direct"
                  >
                    Sign up | Login
                  </button>
                </form>
              </span>
              <span className="sign-up__toggle--hidden">
                <form onSubmit={handleReset} autoComplete="off">
                  <div className="tiny-margin-bottom">
                    <InputField
                      type="email"
                      placeHolder="Email address"
                      value={values.email}
                      onChange={(email) => setValues({ ...values, email })}
                    />
                  </div>

                  {error ? (
                    <div className="form-error tiny-margin-top">
                      {formError}
                    </div>
                  ) : null}
                  <label
                    className="sign-up__forgot-password"
                    htmlFor="sign-up-checkbox"
                  >
                    Actually, I remember it now
                  </label>

                  <button
                    type="submit"
                    className="auth__button auth__button--direct"
                  >
                    Send me a reset link
                  </button>
                </form>
              </span>
            </div>

            <div
              className="auth__button auth__button--google extra-tiny-margin-top"
              onClick={() => {
                providerSignIn("google", () => {
                  window.location.hash = "";
                });
              }}
            >
              google
            </div>
            <div
              className="auth__button auth__button--facebook extra-tiny-margin-top"
              onClick={() => {
                providerSignIn("facebook", () => {
                  window.location.hash = "";
                });
              }}
            >
              facebook
            </div>
            <div className="legal-notice">
              By joining you agree to our{" "}
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
          </div>
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

      case 6:
        return <div>Please check your email for our rest link</div>;
    }
  };

  return (
    <div className="popup" id="sign-up">
      <div className="popup__close">
        <div />
        <div
          className="popup__close-text"
          onClick={() => {
            window.location.hash = "";
            setSubmitting(0);
          }}
        >
          Close
        </div>
      </div>
      {renderContent(submitting, formError)}
    </div>
  );
};

export default connect(null, { signUp, providerSignIn, passwordReset })(SignUp);
