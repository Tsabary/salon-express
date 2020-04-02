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
  renderMinutes
} from "../../../utils/forms";

import { validateWordsLength } from "../../../utils";

import InputField from "../../formComponents/inputField";
import TextArea from "../../formComponents/textArea";
import Tags from "../../formComponents/tags";
import ToggleField from "../../formComponents/toggleField";
import Template from "./template";

const NewStream = ({ newStream, togglePopup, templates, fetchTemplates }) => {
  const [values, setValues] = useState({});
  const [makeTemplate, setMakeTemplate] = useState(false);
  const [isExistingTemplate, setIsExistingTemplate] = useState(false);

  const [hour, setHour] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const { currentUserProfile } = useContext(AuthContext);
  const { addToast } = useToasts();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageAsFile, setImageAsFile] = useState("");

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageAsFile = e => {
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
      console.log(end);
      setValues({ ...values, duration, end });
    }
  }, [hour, minutes]);

  const reset = () => {
    setValues({
      user_ID: currentUserProfile.uid,
      user_name: currentUserProfile.name,
      user_avatar: currentUserProfile.avatar,
      host_name: currentUserProfile.name || "",
      host_twitter: currentUserProfile.twitter || "",
      host_ig: currentUserProfile.instagram || "",
      host_web: currentUserProfile.website || "",
      host_fb: currentUserProfile.facebook || "",
      attendants: [currentUserProfile.uid],
      followers: currentUserProfile.followers
    });

    setSelectedImage(null);
    setImageAsFile("");
    setSubmitting(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!checkValidity(values, setFormError, imageAsFile)) {
      return;
    }

    setFormError(null);
    setSubmitting(true);

    const streamObj = {
      ...values,
      host_twitter: trimURL(values.host_twitter),
      host_ig: trimURL(values.host_ig),
      host_web: trimURL(values.host_web),
      host_fb: trimURL(values.host_fb),
      url: trimURL(values.url)
    };

    newStream(streamObj, imageAsFile, makeTemplate, () => {
      addToast("Event posted", {
        appearance: "success",
        autoDismiss: true
      });
      togglePopup();
      reset();
      window.location.hash = "";
    });
  };

  const renderTemplates = temps => {
    return temps.map(t => {
      return (
        <Template
          template={t}
          key={t.id}
          setTemplate={() => {
            setValues({ ...t, from_template: true });
            setIsExistingTemplate(true);
          }}
        />
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
            togglePopup();
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
              <div className="popup__title">Share a Stream</div>
              {templates.length ? (
                <label
                  className="add-stream__template-button cenetered"
                  htmlFor="add-stream-checkbox"
                >
                  Use a template
                </label>
              ) : null}

              <form
                onSubmit={handleSubmit}
                className="small-margin-top"
                autoComplete="off"
              >
                <label
                  htmlFor="add-stream-img"
                  className="cover-image__container clickable"
                >
                  <img
                    className="cover-image__preview clickable"
                    src={
                      selectedImage || values.image || "./imgs/placeholder.jpg"
                    }
                  />
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
                  onChange={title => {
                    if (title.length < 60 && validateWordsLength(title, 25))
                      setValues({ ...values, title });
                  }}
                  required={true}
                />
                <TextArea
                  type="text"
                  placeHolder="Extra details"
                  value={values.body}
                  onChange={body => {
                    if (body.length < 300 && validateWordsLength(body, 25))
                      setValues({ ...values, body });
                  }}
                  required={true}
                />

                <InputField
                  type="text"
                  placeHolder="Host name"
                  value={values.host_name}
                  onChange={host_name => {
                    if (
                      host_name.length < 30 &&
                      validateWordsLength(host_name, 15)
                    )
                      setValues({ ...values, host_name });
                  }}
                  required={true}
                />

                <div className="add-stream__date">
                  <DatePicker
                    selected={values.start}
                    onChange={start => {
                      if (
                        Object.prototype.toString.call(start) ===
                        "[object Date]"
                      ) {
                        setValues({
                          ...values,
                          start
                        });
                      } else {
                        delete values.start;
                      }
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="input-field__input"
                    placeholderText="Click to select a starting time"
                    minDate={new Date()}
                    excludeOutOfBoundsTimes
                  />
                </div>
                <div className="fr-fr">
                  <Form.Control
                    as="select"
                    value={hour + " hours"}
                    bsPrefix="input-field__input form-drop"
                    onChange={v => setHour(v.target.value.split(" ")[0])}
                  >
                    {renderHours()}
                  </Form.Control>

                  <Form.Control
                    as="select"
                    value={minutes + " minutes"}
                    bsPrefix="input-field__input form-drop"
                    onChange={v => setMinutes(v.target.value.split(" ")[0])}
                  >
                    {renderMinutes()}
                  </Form.Control>
                </div>

                <InputField
                  type="text"
                  placeHolder="Link to the stream"
                  value={values.url}
                  onChange={url => {
                    setValues({ ...values, url });
                  }}
                  required={true}
                />

                <InputField
                  type="text"
                  placeHolder="Price in USD (leave empty if free)"
                  value={values.price}
                  onChange={price => {
                    setValues({ ...values, price });
                  }}
                  isNumber={true}
                  required={true}
                />

                <InputField
                  type="text"
                  placeHolder="Host Instagram page"
                  value={values.host_ig}
                  onChange={host_ig => {
                    setValues({ ...values, host_ig });
                  }}
                />

                <InputField
                  type="text"
                  placeHolder="Host Facebook page"
                  value={values.host_fb}
                  onChange={host_fb => {
                    setValues({ ...values, host_fb });
                  }}
                />

                <InputField
                  type="text"
                  placeHolder="Host Twitter account"
                  value={values.host_twitter}
                  onChange={host_twitter => {
                    setValues({ ...values, host_twitter });
                  }}
                />

                <InputField
                  type="text"
                  placeHolder="Host website"
                  value={values.host_web}
                  onChange={host_web => {
                    setValues({ ...values, host_web });
                  }}
                />

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
                />

                {formError ? (
                  <div className="form-error small-margin-top">{formError}</div>
                ) : null}

                <div className="popup__button medium-margin-top">
                  <button type="submit" className="boxed-button">
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

const mapStateToProps = state => {
  return {
    templates: state.templates
  };
};

export default connect(mapStateToProps, {
  newStream,
  togglePopup,
  fetchTemplates
})(NewStream);
