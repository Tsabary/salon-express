import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import validator from "validator";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useToasts } from "react-toast-notifications";

import { AuthContext } from "../../../providers/Auth";

import { newStream, togglePopup } from "../../../actions";

import InputField from "../../formComponents/inputField";
import TextArea from "../../formComponents/textArea";
import Tags from "../../formComponents/tags";

const NewStream = ({ newStream, togglePopup }) => {
  const [values, setValues] = useState({});

  const { currentUserProfile } = useContext(AuthContext);
  const { addToast } = useToasts();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageAsFile, setImageAsFile] = useState("");

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageAsFile = e => {
    const image = e.target.files[0];
    setImageAsFile(imageFile => image);
    setSelectedImage(URL.createObjectURL(image));
  };

  const errorMessages = {
    title: "please add a title for this stream",
    body: "Please add some extra description for this stream",
    image: "Please add an image for this stream",
    url: "Please add link to this stream",
    startTime: "Please choose a starting time for this stream",
    endTime: "Please choose an end time for this stream",
    tagsMin: "Please add at least 2 tags",
    tagsMax: "Add up to 5 tags maximum"
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
  };

  const checkValidity = () => {
    switch (true) {
      case !values.title:
        setFormError(errorMessages.title);
        return false;

      case !values.body:
        setFormError(errorMessages.body);
        return false;

      case !imageAsFile:
        setFormError(errorMessages.image);
        return false;

      case !validator.isURL(values.url):
        setFormError(errorMessages.url);
        return false;

      case !values.start_timestamp:
        setFormError(errorMessages.startTime);
        return false;

      case !values.end_timestamp:
        setFormError(errorMessages.endTime);
        return false;

      case (values && !values.tags) || (values.tags && values.tags.length < 2):
        setFormError(errorMessages.tagsMin);
        return false;

      default:
        setSubmitting(true);
        setFormError(null);
        return true;
    }
  };

  return (
    <div className="popup" id="new-stream">
      <div className="popup__container">
        <a
          className="popup__close"
          href="#"
          onClick={() => {
            togglePopup();
            reset();
          }}
        >
          <div />
          Close
        </a>
        <div className="popup__title">Share a Stream</div>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (!checkValidity()) {
              return;
            }

            newStream(values, imageAsFile, () => {
              addToast("Event posted", {
                appearance: "success",
                autoDismiss: true
              });
              togglePopup();
              reset();
            });
          }}
        >
          <label htmlFor="add-stream-img" className="add-stream__label">
            <div className="cover-image__container clickable">
              <img
                className="cover-image__preview clickable"
                src={selectedImage}
              />
            </div>
          </label>
          <input
            id="add-stream-img"
            className="add-stream__img-input"
            type="file"
            onChange={handleImageAsFile}
          />

          <InputField
            type="text"
            placeHolder="Title"
            value={values.title}
            onChange={title => {
              if (title.length < 60) setValues({ ...values, title });
            }}
            label="Title"
            required={true}
          />
          <TextArea
            type="text"
            placeHolder="Extra details"
            value={values.body}
            onChange={body => {
              if (body.length < 300) setValues({ ...values, body });
            }}
            label="Extra details"
            required={true}
          />

          <InputField
            type="text"
            placeHolder="Host name"
            value={values.host_name}
            onChange={host_name => {
              setValues({ ...values, host_name });
            }}
            label="Host name"
            required={true}
          />

          <InputField
            type="text"
            placeHolder="Host Instagram page"
            value={values.host_ig}
            onChange={host_ig => {
              setValues({ ...values, host_ig });
            }}
            label="Host Instagram page"
          />

          <InputField
            type="text"
            placeHolder="Host Facebook page"
            value={values.host_fb}
            onChange={host_fb => {
              setValues({ ...values, host_fb });
            }}
            label="Host Facebook page"
          />

          <InputField
            type="text"
            placeHolder="Host website"
            value={values.host_web}
            onChange={host_web => {
              setValues({ ...values, host_web });
            }}
            label="Host website"
          />

          <div className="add-stream__date">
            <DatePicker
              selected={values.start_date}
              onChange={start_date => {
                if (
                  Object.prototype.toString.call(start_date) === "[object Date]"
                ) {
                  setValues({
                    ...values,
                    start_date,
                    start_timestamp: start_date.getTime()
                  });
                } else {
                  delete values.start_date;
                  delete values.start_timestamp;
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

          {values.start_date &&
          Object.prototype.toString.call(values.start_date) ? (
            <div className="add-stream__date">
              <DatePicker
                selected={values.end_date}
                onChange={end_date => {
                  if (
                    Object.prototype.toString.call(end_date) === "[object Date]"
                  ) {
                    setValues({
                      ...values,
                      end_date,
                      end_timestamp: end_date.getTime()
                    });
                  } else {
                    delete values.end_date;
                    delete values.end_timestamp;
                  }
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="input-field__input"
                placeholderText="Click to select an end time"
                minDate={values.start_date}
                excludeOutOfBoundsTimes
              />
            </div>
          ) : null}

          <InputField
            type="text"
            placeHolder="Link to the stream"
            value={values.url}
            onChange={url => {
              setValues({ ...values, url });
            }}
            label="Link to the stream"
            required={true}
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
            <button type="submit" className="boxed-button">
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    tags: state.tags
  };
};

export default connect(mapStateToProps, { newStream, togglePopup })(NewStream);
