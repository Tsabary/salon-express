import "./styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loader-spinner";
import { useToasts } from "react-toast-notifications";

import { AuthContext } from "../../../providers/Auth";

import { signupToNewletter } from "../../../actions/global";

import { validateWordsLength } from "../../../utils/strings";

import InputField from "../../formComponents/inputField";
import { GlobalContext } from "../../../providers/Global";
import TextArea from "../../formComponents/textArea";
import validator from "validator";

const PremiumPlan = ({ signupToNewletter }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { upgradePlan, setUpgradePlan } = useContext(GlobalContext);
  const { addToast } = useToasts();

  const [values, setValues] = useState({});

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUserProfile) {
      reset(currentUserProfile);
    }
  }, [currentUserProfile]);

  // Reset the form
  const reset = (currentUserProfile) => {
    if (currentUserProfile) {
      setValues({
        user_ID: currentUserProfile.uid,
        email: currentUserProfile.email,
      });
    }

    setSubmitting(false);
  };

  // Handle the submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!values.name) {
      setFormError("Please enter your name");
      return;
    }
    if (!values.email || !validator.isEmail(values.email)) {
      setFormError("Please enter a valid email address");
      return;
    }
    setSubmitting(true);

    signupToNewletter(
      { ...values, plan: upgradePlan, created_on: new Date() },
      () => {
        addToast("We got it!", {
          appearance: "success",
          autoDismiss: true,
        });
        setSubmitting(false);
        window.location.hash = "";
        setUpgradePlan(null);
      }
    );
  };

  return (
    <div className="popup" id="premium-plan">
      <div className="popup__close">
        <div />
        <div
          className="popup__close-text"
          onClick={() => {
            reset();
            window.location.hash = "";
          }}
        >
          Close
        </div>
      </div>
      <div>
        {!submitting ? (
          <div>
            <div className="popup__title">
              Our premium plans will be available soon.
            </div>
            <div className="centered-text premium-plan__sub">
              Drop your email and we'll let you know when they are
            </div>
            <form
              onSubmit={(e) => {
                console.log("nothing");
              }}
              className="small-margin-top"
              autoComplete="off"
            >
              <div className="tiny-margin-bottom">
                <InputField
                  type="text"
                  placeHolder="Your name"
                  value={values.name}
                  onChange={(name) => {
                    if (name.length < 80 && validateWordsLength(name, 25))
                      setValues({ ...values, name });
                  }}
                />
              </div>

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
                  type="text"
                  placeHolder="Name of organization"
                  value={values.company}
                  onChange={(company) => setValues({ ...values, company })}
                />
              </div>

              <div className="tiny-margin-bottom">
                <TextArea
                  type="email"
                  placeHolder="Anything else?"
                  value={values.extra}
                  onChange={(extra) => setValues({ ...values, extra })}
                />
              </div>

              {formError ? (
                <div className="form-error small-margin-top">{formError}</div>
              ) : null}
              <div className="popup__button tiny-margin-top">
                <button
                  type="button"
                  className="boxed-button"
                  onClick={handleSubmit}
                >
                  Keep me informed
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="centered">
            <Loader type="Grid" color="#6f00ff" height={100} width={100} />
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(null, {
  signupToNewletter,
})(PremiumPlan);
