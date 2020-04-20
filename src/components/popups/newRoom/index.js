import "./styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loader-spinner";
import Form from "react-bootstrap/Form";
import { useToasts } from "react-toast-notifications";
import ReactTooltip from "react-tooltip";

import { AuthContext } from "../../../providers/Auth";

import { newRoom, togglePopup } from "../../../actions";
import { checkValidity, errorMessages } from "../../../utils/forms";

import { validateWordsLength } from "../../../utils/strings";
import {
  renderLanguageOptions,
  getLanguageCode,
  getLanguageName,
} from "../../../utils/languages";

import InputField from "../../formComponents/inputField";
import ToggleButton from "../../formComponents/toggleButton";
import Tags from "../../formComponents/tags";

const NewRoom = ({ newRoom, togglePopup }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { addToast } = useToasts();

  const [values, setValues] = useState({});

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUserProfile) {
      reset();
    }
  }, [currentUserProfile]);

  // Reset the form
  const reset = () => {
    setValues({
      user_ID: currentUserProfile.uid,
      user_avatar: currentUserProfile.avatar,
      user_name: currentUserProfile.name,
      user_username: currentUserProfile.username,
      visitors_count: 0,
      favorites_count: 0,
      listed: true,
      associate: true,
    });
    setSubmitting(false);
  };

  // Handle the submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkValidity(values, setFormError)) {
      return;
    }

    setFormError(null);
    setSubmitting(true);

    newRoom(values, () => {
      addToast("Room Created Succesfully", {
        appearance: "success",
        autoDismiss: true,
      });
      togglePopup(false);
      reset();
      window.location.hash = "";
    });
  };

  return (
    <div className="popup" id="add-room">
      <div className="popup__close">
        <div />
        <a
          className="popup__close-text"
          href="#"
          onClick={() => {
            togglePopup(false);
            reset();
          }}
        >
          Close
        </a>
      </div>
      <div>
        <input
          className="add-room-checkbox"
          type="checkbox"
          id="add-room-checkbox"
        />

        <span className="add-room__visible">
          {!submitting ? (
            <div>
              <div
                className="popup__title"
              >
                Open a Room
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
                    placeHolder="Room name (this can't be changed)"
                    value={values.title}
                    onChange={(title) => {
                      if (title.length < 80 && validateWordsLength(title, 25))
                        setValues({ ...values, title });
                    }}
                    // required={true}
                  />
                </div>

                <Form.Control
                  as="select"
                  bsPrefix="input-field__input form-drop tiny-margin-bottom"
                  value={
                    values.language
                      ? getLanguageName(values.language)
                      : undefined
                  }
                  onChange={(choice) => {
                    if (choice.target.value !== "Choose a language")
                      setValues({
                        ...values,
                        language: getLanguageCode(choice.target.value),
                      });
                  }}
                >
                  {renderLanguageOptions("Choose a language")}
                </Form.Control>

                <div className="max-fr-max tiny-margin-bottom">
                  <label
                    className="toggle-button__label clickable"
                    htmlFor="unlisted"
                  >
                    Make room unlisted
                  </label>

                  <div
                    className="info"
                    data-tip="unlistedtip"
                    data-for="unlistedtip"
                  />
                  <ReactTooltip id="unlistedtip">
                    Checking this would hide this Room from the main feed.
                    <br />
                    Only users with the url would be able to access this room.
                  </ReactTooltip>

                  <ToggleButton
                    id="unlisted"
                    toggleOn={() => setValues({ ...values, listed: false })}
                    toggleOff={() => setValues({ ...values, listed: true })}
                  />
                </div>

                <div className="max-fr-max tiny-margin-bottom">
                  <label
                    className="toggle-button__label clickable"
                    htmlFor="associate"
                  >
                    Associate me as founder
                  </label>

                  <div
                    className="info"
                    data-tip="associatetip"
                    data-for="associatetip"
                  />

                  <ReactTooltip id="associatetip">
                    Checking this would present you as the admin of the Room
                  </ReactTooltip>

                  <ToggleButton
                    id="associate"
                    toggleOn={() => setValues({ ...values, associate: true })}
                    toggleOff={() => setValues({ ...values, associate: false })}
                    isChecked={true}
                  />
                </div>

                <Tags
                  values={values}
                  setValues={setValues}
                  errorMessages={errorMessages}
                  formError={formError}
                  setFormError={setFormError}
                />

                {formError ? (
                  <div className="form-error small-margin-top">{formError}</div>
                ) : null}
                <div className="popup__button medium-margin-top">
                  <button
                    type="button"
                    className="boxed-button"
                    onClick={handleSubmit}
                  >
                    Open
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="centered">
              <Loader type="Grid" color="#6f00ff" height={100} width={100} />
            </div>
          )}
        </span>
        <span className="add-room__hidden">
          <div className="max-fr">
            <label className="text-button-normal" htmlFor="add-room-checkbox">
              &larr; Back to form
            </label>
            <div />
          </div>
          <div className="add-room__templates">Hidden stuff </div>
        </span>
      </div>
    </div>
  );
};

export default connect(null, {
  newRoom,
  togglePopup,
})(NewRoom);
