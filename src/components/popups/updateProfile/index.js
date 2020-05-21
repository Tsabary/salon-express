import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import Form from "react-bootstrap/Form";

import { AuthContext } from "../../../providers/Auth";

import { updateProfile } from "../../../actions/users";
import { validateWordsLength } from "../../../utils/strings";
import {
  mixCloudTrim,
  instagramTrim,
  spotifyTrim,
  beatportTrim,
} from "../../../utils/websiteTrims";
import { errorMessages, trimURL } from "../../../utils/forms";
import {
  renderLanguageOptions,
  getLanguageCode,
  getLanguageName,
} from "../../../utils/languages";

import InputField from "../../formComponents/inputField";
import validator from "validator";

const UpdateProfile = ({ updateProfile }) => {
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
        setFormError(errorMessages.ig);
        return false;

      case values.facebook && !validator.isURL(values.facebook):
        setFormError(errorMessages.fb);
        return false;

      case values.twitter && !validator.isURL(values.twitter):
        setFormError(errorMessages.twitter);
        return false;

      case values.soundcloud && !validator.isURL(values.soundcloud):
        setFormError(errorMessages.soundcloud);
        return false;

      case values.spotify && !validator.isURL(values.spotify):
        setFormError(errorMessages.spotify);
        return false;

      case values.youtube && !validator.isURL(values.youtube):
        setFormError(errorMessages.youtube);
        return false;

      case values.linkedin && !validator.isURL(values.linkedin):
        setFormError(errorMessages.linkedin);
        return false;

      case values.website && !validator.isURL(values.website):
        setFormError(errorMessages.web);
        return false;

      default:
        setFormError(null);
        return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newProfile = {};

      Object.keys(values).forEach((el) => {
        console.log(values[el]);
        console.log(typeof values[el] === "string");
        console.log(
          typeof values[el] === "string" && validator.isURL(values[el])
        );
        newProfile[el] =
          typeof values[el] === "string" &&
          validator.isURL(values[el]) &&
          values[el] === "avatar"
            ? trimURL(values[el])
            : values[el];
      });

      setSubmitting(true);
      updateProfile(
        newProfile,
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
        <div
          className="popup__close-text"
          onClick={() => {
            window.location.hash = "";
          }}
        >
          Close
        </div>
      </div>
      {!submitting ? (
        <div>
          {/* <div className="popup__title">Update Profile</div> */}
          <form onSubmit={(e) => handleSubmit(e)}>
            <div
              className="update-profile__top"
              onClick={() => console.log("profile", currentUserProfile)}
            >
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
                    alt="Profile"
                  />
                </label>
                <input
                  id="update-profile-image"
                  className="update-profile__upload"
                  type="file"
                  onChange={handleImageAsFile}
                />
              </span>
              {/* 
              <div className="update-profile__message">
                The following info would appear in your profile. You don't have
                to include any of these details, but they might help others form
                initial small talk in your first interaction.
              </div> */}
            </div>

            <div className="update-profile__fields">
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
                  if (username.length < 30 && validateWordsLength(username, 30))
                    setValues({
                      ...values,
                      username: username
                        .toLowerCase()
                        .replace(/[^\p{L}\s]+/gu, "")
                        .trim(),
                    });
                }}
              />

              <InputField
                type="text"
                placeHolder="Brief description of yourself"
                value={values.description}
                onChange={(description) => {
                  if (
                    description.length < 120 &&
                    validateWordsLength(description, 20)
                  )
                    setValues({ ...values, description });
                }}
                required={true}
              />

              <InputField
                type="text"
                placeHolder="Your Instagram page"
                value={values.instagram}
                onChange={(instagram) => {
                  setValues({ ...values, instagram: instagramTrim(instagram) });
                }}
              />

              <InputField
                type="text"
                placeHolder="Your Twitch channel"
                value={values.twitch}
                onChange={(twitch) => {
                  setValues({ ...values, twitch });
                }}
              />

              <InputField
                type="text"
                placeHolder="Your Mixcloud channel"
                value={values.mixcloud}
                onChange={(mixcloud) => {
                  setValues({ ...values, mixcloud: mixCloudTrim(mixcloud) });
                }}
              />

              <InputField
                type="text"
                placeHolder="Your Spotify"
                value={values.spotify}
                onChange={(spotify) => {
                  setValues({ ...values, spotify: spotifyTrim(spotify) });
                }}
              />

              <InputField
                type="text"
                placeHolder="Your Beatport"
                value={values.beatport}
                onChange={(beatport) => {
                  setValues({
                    ...values,
                    beatport: beatportTrim(beatport),
                  });
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

              {/* <InputField
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
              /> */}

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
            </div>
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

export default connect(null, { updateProfile })(UpdateProfile);
