import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";

import firebase from "firebase";

import { AuthContext } from "../../../providers/Auth";

import { updateProfile } from "../../../actions";

import InputField from "../../formComponents/inputField";

const UpdateProfile = ({ updateProfile }) => {
  const [values, setValues] = useState({});
  const { currentUserProfile, setCurrentUserProfile, currentUser } = useContext(
    AuthContext
  );

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageAsFile, setImageAsFile] = useState("");

  const handleImageAsFile = e => {
    const image = e.target.files[0];
    setImageAsFile(imageFile => image);
    setSelectedImage(URL.createObjectURL(image));
  };

  useEffect(() => {
    if (!!currentUserProfile) {
      setValues(currentUserProfile);
    }
  }, [currentUserProfile]);

  return (
    <div className="popup" id="update-profile">
      <div className="popup__container">
        <a className="popup__close" href="#">
          <div />
          סגירה
        </a>
        <div className="popup__title">עדכון פרופיל</div>
        <form
          onSubmit={() =>
            updateProfile(values, currentUser,currentUserProfile, imageAsFile, () =>
              setCurrentUserProfile({
                ...values,
                avatar: selectedImage || currentUserProfile.avatar
              })
            )
          }
        >
          <label htmlFor="update-profile-image" className="new-event__label">
            <div className="round-image__container round-image__container--profile-form">
              <img
                className="round-image clickable"
                src={
                  selectedImage ||
                  (currentUserProfile && currentUserProfile.avatar) ||
                  "../../imgs/logo.jpeg"
                }
              />
            </div>
          </label>
          <input
            id="update-profile-image"
            className="update-profile__upload"
            type="file"
            onChange={handleImageAsFile}
          />

          <InputField
            type="text"
            placeHolder="Name"
            value={values.name}
            onChange={name => setValues({ ...values, name })}
            label="Name"
          />


          <div className="popup__button medium-margin-top">
            <button type="submit" className="boxed-button">
              עדכון
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default connect(null, { updateProfile })(UpdateProfile);
