import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";

import Form from "react-bootstrap/Form";

import { AuthContext } from "../../../../providers/Auth";

import { validateWordsLength } from "../../../../utils/strings";
import {
  errorMessages,
  renderCategories,
  proffesionalCategories,
  getCategoryName,
  getCategoryCode,
} from "../../../../utils/forms";
import { updateProfile } from "../../../../actions/users";
import { fetchSkills } from "../../../../actions/global";

import InputField from "../../../formComponents/inputField";
import Tags from "../../../formComponents/tags";
import ToggleField from "../../../formComponents/toggleButton";
import ToggleButton from "../../../formComponents/toggleButton";

const ProfileSettingsSlider = ({
  profile,
  isSettingsEdited,
  setIsSettingsEdited,
  skills,
  updateProfile,
  fetchSkills,
}) => {
  const { currentUserProfile, setCurrentUserProfile, currentUser } = useContext(
    AuthContext
  );
  const [values, setValues] = useState({});
  const [skill, setSkill] = useState("");
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    console.log("isSettingsEdited", isSettingsEdited);
  }, [isSettingsEdited]);

  useEffect(() => {
    if (!skills.length) fetchSkills();
  });

  useEffect(() => {
    if (currentUserProfile) {
      setValues(currentUserProfile);
    }
  }, [currentUserProfile]);

  const handleSubmit = (e) => {
    e.preventDefault();

    updateProfile(values, currentUser, currentUserProfile, null, () => {
      setCurrentUserProfile(values);
      setIsSettingsEdited(false);
    });
  };

  return profile ? (
    <div className="profile-edit-settings-slider">
      <input
        type="checkbox"
        className="profile-edit-settings-slider__checkbox"
        id="profile-edit-settings-slider-toggle"
        checked={isSettingsEdited}
        readOnly
      />

      <form
        className="profile-edit-settings-slider__content"
        onSubmit={(e) => handleSubmit(e)}
        autoComplete="off"
      >
        <div className="profile-edit-slider__title fr-max small-margin-bottom">
          <div>Edit Proffesional Settings</div>
          <div className="clickable" onClick={() => setIsSettingsEdited(false)}>
            ✖
          </div>
        </div>

        <div
          className="input-field__input clickable"
          onClick={() =>
            setValues((val) => {
              return { ...val, guest_embed: !val.guest_embed };
            })
          }
        >
          <div className="fr-max" style={{paddingTop: ".6rem"}}>
            <div>Allow approved visitors to embed live content</div>
            <ToggleButton isChecked={values.guest_embed} />
          </div>
        </div>

        <Form.Control
          as="select"
          bsPrefix="input-field__input form-drop tiny-margin-bottom tiny-margin-top"
          value={getCategoryName(values.category)}
          onChange={(choice) => {
            if (choice.target.value !== "Professional category")
              setValues({
                ...values,
                category: getCategoryCode(choice.target.value),
              });
          }}
        >
          <option className="form-drop">Professional category</option>
          {renderCategories(proffesionalCategories)}
        </Form.Control>

        <div className="profile-edit-slider__fields" className="fr">
          {/* <div className="profile-edit-slider__title tiny-margin-top">
            Your skills
          </div> */}

          <Tags
            tags={skills}
            values={values}
            setValues={setValues}
            field="skills"
            errorMessages={errorMessages}
            formError={formError}
            setFormError={setFormError}
            placeHolder="Add your skills"
            // className="tiny-margin-top"
          />
        </div>

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

const mapStateToProps = (state) => {
  return { skills: state.skills };
};

export default connect(mapStateToProps, { updateProfile, fetchSkills })(
  ProfileSettingsSlider
);
