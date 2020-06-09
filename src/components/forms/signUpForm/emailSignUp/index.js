import "./styles.scss";
import React, { useState } from "react";

import validator from "validator";

import { signUp, passwordReset } from "../../../../actions/users";

import InputField from "../../../formComponents/inputField";
import { connect } from "react-redux";

const EmailSignup = ({ setSubmitting, signUp, passwordReset }) => {
  const [values, setValues] = useState({});
  const [formError, setFormError] = useState("");

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

  return (
    <div className="email-sign-up__toggle tiny-margin-top">
      <input
        className="email-sign-up-forgot-checkbox"
        type="checkbox"
        id="email-sign-up-forgot-checkbox"
      />
      <span className="email-sign-up__toggle--visible">
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="email-sign-up__form"
        >
          <div className="email-sign-up__email-fields">
            <InputField
              type="email"
              placeHolder="Email address"
              value={values.email}
              onChange={(email) => setValues({ ...values, email })}
            />

            <div className="extra-tiny-margin-bottom">
              <InputField
                type="password"
                placeHolder="Password"
                value={values.password}
                onChange={(password) => setValues({ ...values, password })}
              />
            </div>
          </div>

          {formError ? (
            <div className="form-error tiny-margin-top">{formError}</div>
          ) : null}
          <label
            className="email-sign-up__forgot-password"
            htmlFor="email-sign-up-forgot-checkbox"
          >
            I forgot my password
          </label>

          <button type="submit" className="auth__button auth__button--email">
            Sign up | Login
          </button>
        </form>
      </span>

      <span className="email-sign-up__toggle--hidden">
        <form
          onSubmit={handleReset}
          autoComplete="off"
          className="email-sign-up__form"
        >
          <div className="email-sign-up__email-fields tiny-margin-bottom">
            <InputField
              type="email"
              placeHolder="Email Address"
              value={values.email}
              onChange={(email) => setValues({ ...values, email })}
            />
          </div>

          {formError ? (
            <div className="form-error tiny-margin-top">{formError}</div>
          ) : null}
          <label
            className="email-sign-up__forgot-password"
            htmlFor="email-sign-up-forgot-checkbox"
          >
            I remember it now
          </label>

          <button type="submit" className="auth__button auth__button--email">
            Send me a reset link
          </button>
        </form>
      </span>
    </div>
  );
};

export default connect(null, { signUp, passwordReset })(EmailSignup);
