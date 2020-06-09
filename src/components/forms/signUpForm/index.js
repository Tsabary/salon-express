import "./styles.scss";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import firebase from "firebase/app";

import { ReactSVG } from "react-svg";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import history from "../../../history";

import { providerSignIn } from "../../../actions/users";

import EmailSignup from "./emailSignUp";

const SignUpForm = ({ providerSignIn }) => {
  const myHistory = useHistory(history);

  const [submitting, setSubmitting] = useState(0);

  useEffect(() => {
    return function cleanup() {
      setSubmitting(0);
    };
  });

  const handleChange = (page, path) => {
    firebase.analytics().logEvent("signup_navigation", { page });
    myHistory.push(`/${path}`);
    window.location.hash = "";
    window.scrollTo(0, 0);
  };

  const renderContent = (state) => {
    switch (state) {
      case 0:
        return (
          <div className="sign-up">
            <div
              className="auth__button auth__button--google extra-tiny-margin-top hover-up"
              onClick={() => {
                providerSignIn("google", () => {
                  window.location.hash = "";
                });
              }}
            >
              <div>Sign up with Google</div>
              <div className="auth__icon-frame">
                <ReactSVG
                  src={"../authIcons/googleColorful.svg"}
                  wrapper="div"
                  beforeInjection={(svg) => {
                    svg.classList.add("svg-icon--normal");
                  }}
                />
              </div>
            </div>
            <div
              className="auth__button auth__button--facebook extra-tiny-margin-top hover-up"
              onClick={() => {
                providerSignIn("facebook", () => {
                  window.location.hash = "";
                });
              }}
            >
              <div>Sign up with Facebook</div>

              <div className="auth__icon-frame">
                <ReactSVG
                  src={"../authIcons/facebook.svg"}
                  wrapper="div"
                  beforeInjection={(svg) => {
                    svg.classList.add("svg-icon--normal");
                  }}
                />
              </div>
            </div>

            <div className="auth__button auth__button--email extra-tiny-margin-top hover-up">
              <label htmlFor="sign-up-email-checkbox" className="clickable" style={{marginTop:".5rem"}}>
                Sign up with Email
              </label>
              <div className="auth__icon-frame">
                <ReactSVG
                  src={"../authIcons/email.svg"}
                  wrapper="div"
                  beforeInjection={(svg) => {
                    svg.classList.add("svg-icon--normal");
                  }}
                />
              </div>
            </div>
            <input
              className="sign-up-email-checkbox"
              type="checkbox"
              id="sign-up-email-checkbox"
            />

            <EmailSignup setSubmitting={setSubmitting} />

            <div className="legal-notice centered-text">
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

  return renderContent(submitting);
};

export default connect(null, { providerSignIn })(SignUpForm);
