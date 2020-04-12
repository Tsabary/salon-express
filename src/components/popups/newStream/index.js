import "./styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loader-spinner";
import Form from "react-bootstrap/Form";
import { useToasts } from "react-toast-notifications";

import { AuthContext } from "../../../providers/Auth";

import { newStream, togglePopup, fetchTemplates } from "../../../actions";
import {
  checkValidity,
  errorMessages,
  trimURL,
  renderHours,
  renderMinutes,
} from "../../../utils/forms";

import { validateWordsLength } from "../../../utils/strings";
import {
  renderLanguageOptions,
  getLanguageCode,
  getLanguageName,
} from "../../../utils/languages";

import InputField from "../../formComponents/inputField";
import TextArea from "../../formComponents/textArea";
import Tags from "../../formComponents/tags";
import ToggleField from "../../formComponents/toggleField";
import Template from "./template";

const NewStream = ({ newStream, togglePopup, templates, fetchTemplates }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { addToast } = useToasts();

  const [values, setValues] = useState({});

  const [tipsWelcome, setTipsWelcome] = useState(false);

  const [makeTemplate, setMakeTemplate] = useState(false);

  const practiceLanguageDefault = "What language do you want to practice?";
  const baseLanguageDefault = "What should be the base language?";

  const [hour, setHour] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageAsFile, setImageAsFile] = useState("");

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile(() => image);
    setSelectedImage(URL.createObjectURL(image));
  };

  useEffect(() => {
    if (currentUserProfile) {
      fetchTemplates(currentUserProfile.uid);
      reset();
    }
  }, [currentUserProfile]);

  useEffect(() => {
    if (values.start) {
      const duration = hour * 3600000 + minutes * 60000;
      const end = new Date(values.start.getTime() + duration);
      setValues({ ...values, end, duration });
    }
  }, [hour, minutes, values.start]);

  const reset = () => {
    setValues({
      user_ID: currentUserProfile.uid,
      user_name: currentUserProfile.name,
      user_username: currentUserProfile.username,
      user_avatar: currentUserProfile.avatar,
      host_name: currentUserProfile.name || "",
      host_ig: currentUserProfile.instagram || "",
      host_twitter: currentUserProfile.twitter || "",
      host_spotify: currentUserProfile.spotify || "",
      host_soundcloud: currentUserProfile.soundcloud || "",
      host_youtube: currentUserProfile.youtube || "",
      host_fb: currentUserProfile.facebook || "",
      host_web: currentUserProfile.website || "",
      attendants: [currentUserProfile.uid],
      duration: 0,
      level: 1,
    });

    setSelectedImage(null);
    setImageAsFile("");
    setSubmitting(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkValidity(values, setFormError, imageAsFile, tipsWelcome)) {
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

    newStream(streamObj, imageAsFile, makeTemplate, () => {
      addToast("Event posted", {
        appearance: "success",
        autoDismiss: true,
      });
      togglePopup(false);
      reset();
      window.location.hash = "";
    });
  };

  const setTemplate = (t) => {
    setValues({ ...t, from_template: true });
    const hour = Math.floor(t.duration / 3600000);
    const minutes = Math.floor((t.duration % 3600000) / 60000);
    setHour(hour);
    setMinutes(minutes);
  };

  const renderTemplates = (temps) => {
    return temps.map((t) => {
      return (
        <Template template={t} key={t.id} setTemplate={() => setTemplate(t)} />
      );
    });
  };

  return (
    <div className="popup" id="add-stream">
      <div className="popup__close">
        <div />
        <a
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
          className="add-stream-checkbox"
          type="checkbox"
          id="add-stream-checkbox"
        />

        <span className="add-stream__visible">
          {!submitting ? (
            <div>
              <div
                className="popup__title"
                onClick={() => {
                  console.log(checkValidity(values, setFormError, imageAsFile));
                  console.log(values);
                }}
              >
                Host a practice Session
              </div>
              {templates.length ? (
                <label
                  className="add-stream__template-button cenetered"
                  htmlFor="add-stream-checkbox"
                >
                  Use a template
                </label>
              ) : null}

              <form
                onSubmit={(e) => {
                  console.log("nothing");
                }}
                className="small-margin-top"
                autoComplete="off"
              >
                <label
                  htmlFor="add-stream-img"
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
                  id="add-stream-img"
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

                <div className="add-stream__date">
                  <DatePicker
                    selected={values.start}
                    onChange={(start) => {
                      if (
                        Object.prototype.toString.call(start) ===
                        "[object Date]"
                      ) {
                        setValues({
                          ...values,
                          start,
                        });
                      } else {
                        delete values.start;
                      }
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="input-field__input clickable"
                    placeholderText="Starting time (in your timezone)"
                    minDate={new Date()}
                    excludeOutOfBoundsTimes
                  />
                </div>
                <div className="fr-fr">
                  <Form.Control
                    as="select"
                    value={hour + " hours"}
                    bsPrefix="input-field__input form-drop clickable"
                    onChange={(v) => setHour(v.target.value.split(" ")[0])}
                  >
                    {renderHours()}
                  </Form.Control>

                  <Form.Control
                    as="select"
                    value={minutes + " minutes"}
                    bsPrefix="input-field__input form-drop  clickable"
                    onChange={(v) => setMinutes(v.target.value.split(" ")[0])}
                  >
                    {renderMinutes()}
                  </Form.Control>
                </div>
                {/* <InputField
                  type="text"
                  placeHolder="Link to the stream"
                  value={values.url}
                  onChange={(url) => {
                    setValues({ ...values, url });
                  }}
                  required={true}
                /> */}

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

                <ToggleField
                  text="Save this as a new template"
                  toggleOn={() => {
                    setMakeTemplate(true);
                    setValues({ ...values, from_template: true });
                  }}
                  toggleOff={() => {
                    setMakeTemplate(false);
                    delete values.from_template;
                  }}
                  id="saveAsTemplate"
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
                    Share
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
        <span className="add-stream__hidden">
          <div className="max-fr">
            <label className="text-button-normal" htmlFor="add-stream-checkbox">
              &larr; Back to form
            </label>
            <div />
          </div>
          <div className="add-stream__templates">
            {renderTemplates(templates)}
          </div>
        </span>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    templates: state.templates,
  };
};

export default connect(mapStateToProps, {
  newStream,
  togglePopup,
  fetchTemplates,
})(NewStream);
