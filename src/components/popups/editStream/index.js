import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import validator from "validator";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useToasts } from "react-toast-notifications";

import { AuthContext } from "../../../providers/Auth";

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

  const handleImageAsFile = e => {
    e.preventDefault();
    const image = e.target.files[0];
    setImageAsFile(imageFile => image);
    setSelectedImage(URL.createObjectURL(image));
  };

  const errorMessages = {
    title: "please add a title for this stream",
    body: "Please add some extra description for this stream",
    url: "Please add link to this stream",
    time: "Please choose a time for this stream",
    tagsMin: "Please add at least 3 tags",
    tagsMax: "Add up to 10 tags maximum"
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
  };

  const checkValidity = () => {
    switch (true) {
      case !values.title:
        setFormError(errorMessages.title);
        return false;

      case !values.body:
        setFormError(errorMessages.body);
        return false;

      case !validator.isURL(values.url):
        setFormError(errorMessages.url);
        return false;

      default:
        setSubmitting(true);
        setFormError(null);
        return true;
    }
  };


  return (
    <div className="popup" id="edited-stream">
      <div className="popup__container">
        <a className="popup__close" href="#" onClick={togglePopup}>
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

            updateStream(
              { ...values, id: editedStream.id },
              values.tags.filter(tag => !originalTags.includes(tag)),
              originalTags.filter(tag => !values.tags.includes(tag)),
              imageAsFile,
              () => {
                addToast("Event posted", {
                  appearance: "success",
                  autoDismiss: true
                });
                togglePopup();
                setEditedStream({});
              }
            );
          }}
        >

          <label htmlFor="edit-stream-img" className="add-stream__label">
            <div className="cover-image__container clickable">
              <img
                className="cover-image__preview clickable"
                src={selectedImage || values.image}
              />
            </div>
          </label>
          <input
            id="edit-stream-img"
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
              selected={
                !values.start_date
                  ? null
                  : Object.prototype.toString.call(values.start_date) ===
                    "[object Date]"
                  ? values.start_date
                  : values.start_date.toDate()
              }
              onChange={start_date => {
                if (Object.prototype.toString.call(start_date) === "[object Date]") {
                  setValues({ ...values, start_date, start_timestamp: start_date.getTime() });
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
              placeholderText="Click to select a date"
              minDate={new Date()}
              excludeOutOfBoundsTimes
            />
          </div>



          <div className="add-stream__date">
            <DatePicker
              selected={
                !values.end_date
                  ? null
                  : Object.prototype.toString.call(values.end_date) ===
                    "[object Date]"
                  ? values.end_date
                  : values.end_date.toDate()
              }
              onChange={end_date => {
                if (Object.prototype.toString.call(end_date) === "[object Date]") {
                  setValues({ ...values, end_date, end_timestamp: end_date.getTime() });
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
              placeholderText="Click to select a date"
              minDate={values.start_date}
              excludeOutOfBoundsTimes
            />
          </div>

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
    tags: state.tags,
    editedStream: state.editedStream
  };
};

export default connect(mapStateToProps, {
  updateStream,
  togglePopup,
  setEditedStream
})(NewStream);
