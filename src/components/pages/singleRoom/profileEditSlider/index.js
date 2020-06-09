import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import validator from "validator";
import { errorMessages, trimURL } from "../../../../utils/forms";
import { AuthContext } from "../../../../providers/Auth";
import { updateProfile } from "../../../../actions/users";
import InputField from "../../../formComponents/inputField";
import { validateWordsLength } from "../../../../utils/strings";
import {
  getPlatformPlaceHolder,
  allPlatforms,
  getPlatformCode,
} from "../../../../utils/externalContent";

const ProfileEditSlider = ({
  profile,
  isProfileEdited,
  setIsProfileEdited,
  updateProfile,
}) => {
  const { currentUserProfile, setCurrentUserProfile, currentUser } = useContext(
    AuthContext
  );
  const [values, setValues] = useState({});
  const [plug, setPlug] = useState("");
  const [redirect, setRedirect] = useState({});
  const [formError, setFormError] = useState(null);

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
      case values.instagram:
        setFormError(errorMessages.ig);
        return false;

      case values.facebook && !validator.isURL(values.facebook):
        setFormError(errorMessages.fb);
        return false;

      case values.twitter:
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
        newProfile[el] =
          typeof values[el] === "string" &&
          validator.isURL(values[el]) &&
          values[el] === "avatar"
            ? trimURL(values[el])
            : values[el];
      });

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
          setIsProfileEdited(false);
        }
      );
    }
  };

  const renderSocialInputs = (social) => {
    return social.map((platform) => {
      return (
        <InputField
          type="text"
          placeHolder={getPlatformPlaceHolder(platform)}
          value={values.social[platform]}
          onChange={(val) => {
            setValues({
              ...values,
              social: { ...values.social, [platform]: val },
            });
          }}
          label={getPlatformPlaceHolder(platform)}
        />
      );
    });
  };

  const renderSuggestions = (p) => {
    return allPlatforms
      .filter((plat) => plat.toLowerCase().startsWith(p.toLowerCase()))
      .slice(0, 5)
      .map((plat) => {
        return (
          <div
            className="profile-edit-slider__suggestion"
            onClick={() => {
              setValues({
                ...values,
                social: { [getPlatformCode(plat)]: "", ...values.social },
              });
            }}
          >
            {plat}
          </div>
        );
      });
  };

  const renderLinks = (links) => {
    return links.map((link) => {
      return (
        <div className="fr-max" key={link.url}>
          <a
            className="small-button"
            href={`https://${link.url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.title}
          </a>
          <div
            className="audio-settings__button"
            onClick={() => {
              setValues({
                ...values,
                links: values.links.filter((l) => l.url !== link.url),
              });
              setRedirect({});
            }}
          >
            -
          </div>
        </div>
      );
    });
  };

  return profile ? (
    <div className="profile-edit-slider">
      <input
        type="checkbox"
        className="profile-edit-slider__checkbox"
        id="profile-edit-slider-toggle"
        checked={isProfileEdited}
        readOnly
      />

      <form
        className="profile-edit-slider__content"
        onSubmit={(e) => handleSubmit(e)}
        autoComplete="off"
      >
        <div className="profile-edit-slider__title fr-max small-margin-bottom">
          <div>Edit Profile</div>
          <div className="clickable" onClick={() => setIsProfileEdited(false)}>
            ✖
          </div>
        </div>

        <div
          className="profile-edit-slider__top"
          onClick={() => console.log("profile", currentUserProfile)}
        >
          {/* <span> */}
          <label
            htmlFor="profile-edit-slider-image"
            className="profile-edit-slider__image-container"
          >
            <img
              className="profile-edit-slider__image-preview clickable"
              src={
                selectedImage ||
                (currentUserProfile && currentUserProfile.avatar) ||
                "../../imgs/logo.jpeg"
              }
              alt="Profile"
            />
          </label>
          <input
            id="profile-edit-slider-image"
            className="profile-edit-slider__upload"
            type="file"
            onChange={handleImageAsFile}
          />
          {/* </span> */}
        </div>

        <div className="profile-edit-slider__fields" className="fr">
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

          <div className="profile-edit-slider__title tiny-margin-top">
            Redirect Buttons
          </div>
          <div className="profile-edit-slider__subtitle">
            Add buttons with links. When you embed external content, they will
            appear by the side of the frame.
          </div>

          {!values.links || values.links.length < 5 ? (
            <div className="fr-max">
              <div>
                <InputField
                  type="text"
                  placeHolder="Button text"
                  value={redirect.title}
                  onChange={(title) => {
                    setRedirect({ ...redirect, title });
                  }}
                  style={{ border: "1px solid #6f00ff" }}
                />
                <InputField
                  type="text"
                  placeHolder="Redirect link"
                  value={redirect.url}
                  onChange={(url) => {
                    setRedirect({ ...redirect, url: trimURL(url) });
                  }}
                  className="extra-tiny-margin-top"
                  style={{ border: "1px solid #6f00ff" }}
                />
              </div>
              <div
                className="audio-settings__button"
                onClick={() => {
                  setValues({
                    ...values,
                    links: values.links
                      ? [...values.links, redirect]
                      : [redirect],
                  });
                  setRedirect({});
                }}
              >
                +
              </div>
            </div>
          ) : null}

          {values.links ? renderLinks(values.links) : null}

          <div className="profile-edit-slider__title tiny-margin-top">
            Your social info
          </div>
          <InputField
            type="text"
            placeHolder="Add a plug"
            value={plug}
            onChange={(p) => {
              setPlug(p);
            }}
            style={{ border: "1px solid #6f00ff" }}
          />

          {plug ? renderSuggestions(plug) : null}

          {values.social
            ? renderSocialInputs(Object.keys(values.social))
            : null}

          {/* <InputField
            type="text"
            placeHolder="Your Instagram handle"
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
          /> */}

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

          {/* <Form.Control
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
              </Form.Control> */}
        </div>
        {/* <div className="small-margin-top">
            {values.languages ? renderLanguages(values.languages) : null}
          </div> */}

        {formError ? (
          <div className="form-error small-margin-top">{formError}</div>
        ) : null}

        <div className="popup__button small-margin-top">
          <button type="submit" className="boxed-button small-margin-bottom">
            Update
          </button>
        </div>
      </form>
    </div>
  ) : null;
};

export default connect(null, { updateProfile })(ProfileEditSlider);
