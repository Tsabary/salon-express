import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loader-spinner";
import Form from "react-bootstrap/Form";

import { useToasts } from "react-toast-notifications";

import { AuthContext } from "../../../providers/Auth";
import { checkValidity, errorMessages, trimURL } from "../../../utils/forms";

import { validateWordsLength } from "../../../utils/strings";
import {
  renderLanguageOptions,
  getLanguageCode,
  getLanguageName,
} from "../../../utils/languages";

import { updateStream, togglePopup, setEditedStream } from "../../../actions";

import InputField from "../../formComponents/inputField";
import TextArea from "../../formComponents/textArea";
import Tags from "../../formComponents/tags";

const NewStream = ({
  editedStream,
  updateStream,
  togglePopup,
  setEditedStream,
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { addToast } = useToasts();

  const [values, setValues] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const practiceLanguageDefault = "What language do you want to practice?";
  const baseLanguageDefault = "What should be the base language?";

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageAsFile, setImageAsFile] = useState("");

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [originalTags, setOriginalTags] = useState([]);


  useEffect(() => {
    if (!editedStream.start) return;
    const startDate = editedStream.start.toDate();
    setValues({ ...editedStream, start: startDate });
    setOriginalTags(editedStream.tags || []);
    setStartTime(startDate);
  }, [editedStream]);

  useEffect(() => {
    if (currentUserProfile) {
      reset();
    }
  }, [currentUserProfile]);

  // Set the end date whenever the start date is set
  useEffect(() => {
    if (
      values &&
      values.start &&
      Object.prototype.toString.call(values.start) === "[object Date]"
    ) {
      const end = new Date(values.start.getTime() + 2700000);
      setValues({ ...values, end });
    }
  }, [startTime]);

  const handleImageAsFile = (e) => {
    e.preventDefault();
    const image = e.target.files[0];
    setImageAsFile(() => image);
    setSelectedImage(URL.createObjectURL(image));
  };

  // Reset the form
  const reset = () => {
    setValues({
      user_ID: currentUserProfile.uid,
      user_name: currentUserProfile.name,
      user_username: currentUserProfile.username,
      user_avatar: currentUserProfile.avatar,
      attendants: [currentUserProfile.uid],
    });

    setSelectedImage(null);
    setImageAsFile("");
    setSubmitting(false);
    setEditedStream({});
  };

  // Handle the form submittion
  const handleSubmit = () => {
    if (!checkValidity(values, setFormError, imageAsFile)) {
      return;
    }
    setFormError(null);
    setSubmitting(true);

    const streamObj = {};

    const valuesKeys = Object.keys(values);
    valuesKeys.forEach((key) => {
      if (typeof values[key] === "string") {
        streamObj[key] = trimURL(values[key]);
      } else {
        streamObj[key] = values[key];
      }
    });

    updateStream(
      streamObj,
      values.tags.filter((tag) => !originalTags.includes(tag)),
      originalTags.filter((tag) => !values.tags.includes(tag)),
      imageAsFile,
      () => {
        addToast("Event updated", {
          appearance: "success",
          autoDismiss: true,
        });
        togglePopup(false);
        reset();
      }
    );
  };

  return !values ? null : (
    <div className="popup" id="edited-stream">
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

      {!submitting ? (
        <div>
          <div className="popup__title">Edit Practice Session</div>
          <form
            onSubmit={(e) => {
              console.log("nothing");
            }}
            className="small-margin-top"
            autoComplete="off"
          >
            <label
              htmlFor="edit-stream-img"
              className="cover-image__container clickable"
            >
              {selectedImage ? (
                <img
                  className="cover-image__preview clickable"
                  src={selectedImage}
                />
              ) : (
                <img
                  className="cover-image__preview clickable"
                  src={
                    !values.image
                      ? "./imgs/placeholder.jpg"
                      : values.image.includes("firebase")
                      ? "https://" + values.image
                      : values.image
                  }
                />
              )}
            </label>

            <input
              id="edit-stream-img"
              className="add-stream__img-input"
              type="file"
              accept="image/*"
              onChange={handleImageAsFile}
            />
            <InputField
              type="text"
              placeHolder="Title"
              value={values.title}
              onChange={(title) => {
                if (title.length < 60 && validateWordsLength(title, 25))
                  setValues({ ...values, title });
              }}
              required={true}
            />
            <TextArea
              type="text"
              placeHolder="Extra details"
              value={values.body}
              onChange={(body) => {
                if (body.length < 400 && validateWordsLength(body, 25))
                  setValues({ ...values, body });
              }}
              required={true}
            />

            <div className="add-stream__date clickable">
              <DatePicker
                selected={
                  !values.start
                    ? null
                    : Object.prototype.toString.call(values.start) ===
                      "[object Date]"
                    ? values.start
                    : values.start.toDate()
                }
                onChange={(start) => {
                  if (
                    Object.prototype.toString.call(start) === "[object Date]"
                  ) {
                    setValues({
                      ...values,
                      start,
                    });
                    setStartTime(start);
                  } else {
                    delete values.start;
                  }
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="input-field__input"
                placeholderText="Starting time (in your timezone)"
                minDate={new Date()}
                excludeOutOfBoundsTimes
              />
            </div>

            <Form.Control
              as="select"
              bsPrefix="input-field__input form-drop"
              value={
                values.practice_language
                  ? getLanguageName(values.practice_language)
                  : undefined
              }
              onChange={(choice) => {
                if (choice.target.value !== practiceLanguageDefault)
                  setValues({
                    ...values,
                    practice_language: getLanguageCode(choice.target.value),
                  });
              }}
            >
              {renderLanguageOptions(practiceLanguageDefault)}
            </Form.Control>

            <Form.Control
              as="select"
              bsPrefix="input-field__input form-drop"
              value={
                values.base_language
                  ? getLanguageName(values.base_language)
                  : undefined
              }
              onChange={(choice) => {
                if (choice.target.value !== baseLanguageDefault)
                  setValues({
                    ...values,
                    base_language: getLanguageCode(choice.target.value),
                  });
              }}
            >
              {renderLanguageOptions(baseLanguageDefault)}
            </Form.Control>

            <Form.Control
              as="select"
              value={values.level}
              bsPrefix="input-field__input form-drop  clickable"
              onChange={(v) =>
                setValues({
                  ...values,
                  level:
                    v.target.value === "Beginner"
                      ? 1
                      : v.target.value === "Mid-Level"
                      ? 3
                      : 5,
                })
              }
            >
              <option className="form-drop" key="beginner">
                Beginner
              </option>

              <option className="form-drop" key="midlevel">
                Mid-Level
              </option>

              <option className="form-drop" key="advanced">
                Advanced
              </option>
            </Form.Control>

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
                Update
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
  );
};

const mapStateToProps = (state) => {
  return {
    tags: state.tags,
    editedStream: state.editedStream,
  };
};

export default connect(mapStateToProps, {
  updateStream,
  togglePopup,
  setEditedStream,
})(NewStream);
