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
  renderMinutes
} from "../../../utils/forms";

import { validateWordsLength } from "../../../utils/strings";

import { updateStream, togglePopup, setEditedStream } from "../../../actions";

import InputField from "../../formComponents/inputField";
import TextArea from "../../formComponents/textArea";
import Tags from "../../formComponents/tags";

const NewStream = ({
  editedStream,
  updateStream,
  togglePopup,
  setEditedStream
}) => {
  const [values, setValues] = useState({});

  const [hour, setHour] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const { currentUserProfile } = useContext(AuthContext);
  const { addToast } = useToasts();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageAsFile, setImageAsFile] = useState("");

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [originalTags, setOriginalTags] = useState([]);

  useEffect(() => {
    setValues(editedStream);
    setOriginalTags(editedStream.tags || []);
  }, [editedStream]);

  useEffect(() => {
    if (values.start) {
      const duration = hour * 3600000 + minutes * 60000;
      const end = new Date(values.start.getTime() + duration);
      setValues({ ...values, duration, end });
    }
  }, [hour, minutes]);

  const handleImageAsFile = e => {
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
      user_avatar: currentUserProfile.avatar,
      attendants: [currentUserProfile.uid]
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

    updateStream(
      { ...values, id: editedStream.id },
      values.tags.filter(tag => !originalTags.includes(tag)),
      originalTags.filter(tag => !values.tags.includes(tag)),
      imageAsFile,
      () => {
        addToast("Event updated", {
          appearance: "success",
          autoDismiss: true
        });
        togglePopup();
        reset();
      }
    );
  };

  return (
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
            onSubmit={e => {
              console.log("nothing");
            }}
            autoComplete="off"
          >
            <label htmlFor="edit-stream-img" className="add-stream__label">
              <div className="cover-image__container clickable">
                <img
                  className="cover-image__preview clickable"
                  src={
                    selectedImage || values.image || "./imgs/placeholder.jpg"
                  }
                />
              </div>
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
                if (host_name.length < 30 && validateWordsLength(host_name, 15))
                  setValues({ ...values, host_name });
              }}
              required={true}
            />

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
                onChange={start => {
                  if (
                    Object.prototype.toString.call(start) === "[object Date]"
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
                placeholderText="Click to select a date"
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

const mapStateToProps = state => {
  return {
    tags: state.tags,
    editedStream: state.editedStream
  };
};

export default connect(mapStateToProps, {
  updateStream,
  togglePopup,
  setEditedStream
})(NewStream);
