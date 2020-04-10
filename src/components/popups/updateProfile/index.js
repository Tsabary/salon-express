import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import Form from "react-bootstrap/Form";

import { AuthContext } from "../../../providers/Auth";

import { updateProfile, togglePopup } from "../../../actions";
import { validateWordsLength } from "../../../utils/strings";
import { errorMessages } from "../../../utils/forms";
import {
  renderLanguageOptions,
  getLanguageCode,
  getLanguageName,
} from "../../../utils/languages";

import InputField from "../../formComponents/inputField";
import validator from "validator";

const UpdateProfile = ({ updateProfile, togglePopup }) => {
  const { currentUserProfile, setCurrentUserProfile, currentUser } = useContext(
    AuthContext
  );
  const [values, setValues] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const languageChoiceDefault = "Choose the languages you speak";

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageAsFile, setImageAsFile] = useState("");

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile(() => image);
    setSelectedImage(URL.createObjectURL(image));
  };

  useEffect(() => {
    if (currentUserProfile) {
      setValues(currentUserProfile);
    }
  }, [currentUserProfile]);

  const validateForm = () => {
    switch (true) {
      case values.instagram && !validator.isURL(values.instagram):
        console.log("ig invalid");
        setFormError(errorMessages.ig);
        return false;

      case values.facebook && !validator.isURL(values.facebook):
        setFormError(errorMessages.fb);
        return false;

      case values.twitter && !validator.isURL(values.twitter):
        setFormError(errorMessages.twitter);
        return false;

      case values.website && !validator.isURL(values.website):
        setFormError(errorMessages.web);
        return false;

      default:
        setFormError(null);
        return true;
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setSubmitting(true);
      updateProfile(
        values,
        currentUser,
        currentUserProfile,
        imageAsFile,
        () => {
          setCurrentUserProfile({
            ...values,
            avatar: selectedImage || currentUserProfile.avatar,
          });
          setSubmitting(false);
        }
      );
    }
  };

  const renderLanguages = (languages) => {
    return languages.map((lan) => {
      return (
        <div
          className="tag tag-selected"
          key={lan}
          onClick={() =>
            setValues({
              ...values,
              languages: values.languages.filter((lang) => lang !== lan),
            })
          }
        >
          {getLanguageName(lan)}
        </div>
      );
    });
  };

  return (
    <div className="popup" id="update-profile">
      <div className="popup__close">
        <div />
        <a
          href="#"
          onClick={() => {
            togglePopup();
          }}
        >
          Close
        </a>
      </div>
      {!submitting ? (
        <div>
          {/* <div className="popup__title">Update Profile</div> */}
          <form onSubmit={handleSubmit}>
            <div className="update-profile__top">
              <span>
                <label
                  htmlFor="update-profile-image"
                  className="update-profile__image-container"
                >
                  <img
                    className="update-profile__image-preview clickable"
                    src={
                      selectedImage ||
                      (currentUserProfile && currentUserProfile.avatar) ||
                      "../../imgs/logo.jpeg"
                    }
                  />
                </label>
                <input
                  id="update-profile-image"
                  className="update-profile__upload"
                  type="file"
                  onChange={handleImageAsFile}
                />
              </span>

              <div className="update-profile__message">
                We use the following details to auto-fill your form when you
                post a new event. If you are posting your own content, fill
                these fields to save yourself the effort. If you are posting
                streams hosted by others, leave these fields empty, as you will
                need to delete them from every new submission.
              </div>
            </div>

            <InputField
              type="text"
              placeHolder="Name"
              value={values.name}
              onChange={(name) => {
                if (name.length < 30 && validateWordsLength(name, 15))
                  setValues({ ...values, name });
              }}
              required={true}
            />

            <InputField
              type="text"
              placeHolder="Username"
              value={values.username !== values.uid ? values.username : null}
              onChange={(username) => {
                if (
                  username.length < 30 &&
                  validateWordsLength(username, 30) &&
                  /^[a-z0-9]+$/.test(username)
                )
                  setValues({
                    ...values,
                    username: username.trim().toLowerCase(),
                  });
              }}
              required={true}
            />

            <InputField
              type="text"
              placeHolder="Brief description of yourself"
              value={values.tagline}
              onChange={(tagline) => {
                if (tagline.length < 120 && validateWordsLength(tagline, 20))
                  setValues({ ...values, tagline });
              }}
              required={true}
            />

            <InputField
              type="text"
              placeHolder="Your Instagram page"
              value={values.instagram}
              onChange={(instagram) => {
                setValues({ ...values, instagram });
              }}
            />

            <InputField
              type="text"
              placeHolder="Your Facebook page"
              value={values.facebook}
              onChange={(facebook) => {
                setValues({ ...values, facebook });
              }}
            />

            <InputField
              type="text"
              placeHolder="Your Twitter"
              value={values.twitter}
              onChange={(twitter) => {
                setValues({ ...values, twitter });
              }}
            />

            <InputField
              type="text"
              placeHolder="Your SoundCloud"
              value={values.soundcloud}
              onChange={(soundcloud) => {
                setValues({ ...values, soundcloud });
              }}
            />

            <InputField
              type="text"
              placeHolder="Your Spotify"
              value={values.spotify}
              onChange={(spotify) => {
                setValues({ ...values, spotify });
              }}
            />

            <InputField
              type="text"
              placeHolder="Your Youtube"
              value={values.youtube}
              onChange={(youtube) => {
                setValues({ ...values, youtube });
              }}
            />

            <InputField
              type="text"
              placeHolder="Your LinkedIn"
              value={values.linkedin}
              onChange={(linkedin) => {
                setValues({ ...values, linkedin });
              }}
            />

            <InputField
              type="text"
              placeHolder="Your website"
              value={values.website}
              onChange={(website) => {
                setValues({ ...values, website });
              }}
            />

            <Form.Control
              as="select"
              bsPrefix="input-field__input form-drop"
              onChange={(choice) => {
                if (
                  choice.target.value !== languageChoiceDefault ||
                  values.languages.length >= 10
                )
                  setValues({
                    ...values,
                    languages: [
                      ...values.languages,
                      getLanguageCode(choice.target.value),
                    ],
                  });
              }}
            >
              {renderLanguageOptions(languageChoiceDefault)}
            </Form.Control>

            <div className="small-margin-top">
              {values.languages ? renderLanguages(values.languages) : null}
            </div>

            {formError ? (
              <div className="form-error small-margin-top">{formError}</div>
            ) : null}

            <div className="popup__button small-margin-top">
              <button type="submit" className="boxed-button">
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

export default connect(null, { updateProfile, togglePopup })(UpdateProfile);
