import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loader-spinner";
import Form from "react-bootstrap/Form";

import { useToasts } from "react-toast-notifications";

import { AuthContext } from "../../../providers/Auth";
import {
  checkValidity,
  errorMessages,
  renderHours,
  renderMinutes,
  trimURL,
} from "../../../utils/forms";

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
import ToggleField from "../../formComponents/toggleField";

const NewStream = ({
  editedStream,
  updateStream,
  togglePopup,
  setEditedStream,
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { addToast } = useToasts();

  const [values, setValues] = useState(null);

  const languageChoiceDefault = "What language would it be in?";

  const [hour, setHour] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageAsFile, setImageAsFile] = useState("");

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [originalTags, setOriginalTags] = useState([]);

  useEffect(() => {
    if (values && values.start) {
      const startDate =
        Object.prototype.toString.call(editedStream.start) === "[object Date]"
          ? editedStream.start
          : editedStream.start.toDate();

      setValues({ ...values, start: startDate });
    }
  }, []);

  useEffect(() => {
    if (values && values.duration) {
      setHour(Math.floor(values.duration / 3600000));
      setMinutes((values.duration % 3600000) / 60000);
    }
  }, [values]);

  useEffect(() => {
    setValues(editedStream);
    setOriginalTags(editedStream.tags || []);
  }, [editedStream]);

  useEffect(() => {
    if (values && values.start) {
      const startDate =
        Object.prototype.toString.call(editedStream.start) === "[object Date]"
          ? editedStream.start
          : editedStream.start.toDate();

      const duration = hour * 3600000 + minutes * 60000;

      const end = new Date(startDate.getTime() + duration);
      setValues({ ...values, duration, end });
    }
  }, [hour, minutes]);

  const handleImageAsFile = (e) => {
    e.preventDefault();
    const image = e.target.files[0];
    setImageAsFile(() => image);
    setSelectedImage(URL.createObjectURL(image));
  };

  useEffect(() => {
    if (currentUserProfile) {
      reset();
    }
  }, [currentUserProfile]);

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
        togglePopup();
        reset();
      }
    );
  };

  return !values ? null : (
    <div className="popup" id="edited-stream">
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

      {!submitting ? (
        <div>
          <div className="popup__title">Edit Stream</div>
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

            {/* <InputField
              type="text"
              placeHolder="Host name"
              value={values.host_name}
              onChange={(host_name) => {
                if (host_name.length < 30 && validateWordsLength(host_name, 15))
                  setValues({ ...values, host_name });
              }}
              required={true}
            /> */}

            <div className="add-stream__date">
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

            <div className="fr-fr">
              <Form.Control
                as="select"
                value={hour + " hours"}
                bsPrefix="input-field__input form-drop"
                onChange={(v) => setHour(v.target.value.split(" ")[0])}
              >
                {renderHours()}
              </Form.Control>

              <Form.Control
                as="select"
                value={minutes + " minutes"}
                bsPrefix="input-field__input form-drop"
                onChange={(v) => setMinutes(v.target.value.split(" ")[0])}
              >
                {renderMinutes()}
              </Form.Control>
            </div>

            <InputField
              type="text"
              placeHolder="Link to the stream"
              value={values.url}
              onChange={(url) => {
                setValues({ ...values, url });
              }}
              required={true}
            />

            <InputField
              type="text"
              placeHolder="Link for tips and donations"
              value={values.tips_link}
              onChange={(tips_link) => {
                setValues({ ...values, tips_link });
              }}
            />

            {values.language ? (
              <Form.Control
                as="select"
                bsPrefix="input-field__input form-drop"
                value={getLanguageName(values.language)}
                onChange={(choice) => {
                  if (choice.target.value !== languageChoiceDefault)
                    setValues({
                      ...values,
                      language: getLanguageCode(choice.target.value),
                    });
                }}
              >
                {renderLanguageOptions(languageChoiceDefault)}
              </Form.Control>
            ) : null}

            {/* <InputField
              type="text"
              placeHolder="Price in USD (leave empty if free)"
              value={values.price}
              onChange={(price) => {
                setValues({ ...values, price });
              }}
              isNumber={true}
            /> */}

            <InputField
              type="text"
              placeHolder="Host Instagram page"
              value={values.host_ig}
              onChange={(host_ig) => {
                setValues({ ...values, host_ig });
              }}
            />

            <InputField
              type="text"
              placeHolder="Host Facebook page"
              value={values.host_fb}
              onChange={(host_fb) => {
                setValues({ ...values, host_fb });
              }}
            />

            <InputField
              type="text"
              placeHolder="Host Twitter account"
              value={values.host_twitter}
              onChange={(host_twitter) => {
                setValues({ ...values, host_twitter });
              }}
            />

            <InputField
              type="text"
              placeHolder="Host Soundcloud account"
              value={values.host_soundcloud}
              onChange={(host_soundcloud) => {
                setValues({ ...values, host_soundcloud });
              }}
            />

            <InputField
              type="text"
              placeHolder="Host Spotify account"
              value={values.host_spotify}
              onChange={(host_spotify) => {
                setValues({ ...values, host_spotify });
              }}
            />

            <InputField
              type="text"
              placeHolder="Host Youtube account"
              value={values.host_youtube}
              onChange={(host_youtube) => {
                setValues({ ...values, host_youtube });
              }}
            />

            <InputField
              type="text"
              placeHolder="Host LinkedIn account"
              value={values.host_linkedin}
              onChange={(host_linkedin) => {
                setValues({ ...values, host_linkedin });
              }}
            />

            <InputField
              type="text"
              placeHolder="Host website"
              value={values.host_web}
              onChange={(host_web) => {
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
