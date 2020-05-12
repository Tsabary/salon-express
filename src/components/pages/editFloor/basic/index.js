import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { checkUrlAvailability } from "../../../../actions/floors";

import { validateWordsLength } from "../../../../utils/strings";
import {
  getLanguageName,
  getLanguageCode,
  renderLanguageOptions,
} from "../../../../utils/languages";
import { checkValidity, errorMessages } from "../../../../utils/forms";

import InputField from "../../../formComponents/inputField";
import ToggleField from "../../../formComponents/toggleField";
import TextArea from "../../../formComponents/textArea";
import Tags from "../../../formComponents/tags";

const Basic = ({
  floor,
  values,
  setValues,
  setRooms,
  setChosenPlan,
  checkUrlAvailability,
}) => {
  const [formError, setFormError] = useState(null);
  const [urlError, setUrlError] = useState(null);
  const [urlApproved, setUrlApproved] = useState(false);
  const [urlButton, setUrlButton] = useState("Check Availability");
  const [floorOpen, setFloorOpen] = useState(true);
  const [tempUrl, setTempUrl] = useState("");

  useEffect(() => {
    if (floor) {
      setValues(floor);
      setTempUrl(floor.url);
      Object.values(floor.rooms).forEach((r, index) => {
        setRooms((ro) => {
          return { ...ro, [index]: r };
        });
      });
      setChosenPlan({
        image: floor.image,
        rooms: [...Object.values(floor.rooms)],
      });
    }
  }, [floor]);

  const checkAvailability = () => {
    if (tempUrl) {
      checkUrlAvailability(
        tempUrl,
        () => setUrlError("This URL extension is already taken"),
        () => {
          setUrlApproved(true);
          setUrlButton("Available");
          setValues({
            ...values,
            url: tempUrl,
          });
        }
      );
    } else {
      setUrlError("URL extension can't be empty");
    }
  };

  return (
    <div className="edit-floor__section">
      <div className="edit-floor__section-title">Basic details</div>
      <div className="fr">
        <InputField
          type="text"
          placeHolder="Floor name"
          value={values.name}
          onChange={(name) => {
            if (name.length < 80 && validateWordsLength(name, 25))
              setValues({ ...values, name });
          }}
        />

        <TextArea
          type="text"
          placeHolder="Floor description"
          value={values.description}
          onChange={(description) => {
            if (
              description.length < 500 &&
              validateWordsLength(description, 25)
            )
              setValues({ ...values, description });
          }}
        />
        <div className={floor && floor.url !== tempUrl ? "fr-max" : "fr"}>
          <div className="input-field__input max-fr">
            <span>salon.express/floor/</span>
            <input
              className="edit-floor__basic-url"
              type="text"
              placeholder=""
              value={tempUrl}
              onChange={(e) => {
                setTempUrl(e.target.value.replace(/[^\p{L}\s]+/gu, ""));
                setUrlApproved(false);
                setUrlButton("Check Availability");
              }}
            />
          </div>
          {floor && floor.url !== tempUrl ? (
            <div
              className={
                urlApproved
                  ? "small-button small-button--disabled"
                  : "small-button"
              }
              onClick={() => checkAvailability()}
            >
              {urlButton}
            </div>
          ) : null}
        </div>

        {urlError ? <div className="form-error">{urlError} </div> : null}

        <Form.Control
          as="select"
          bsPrefix="input-field__input form-drop"
          value={values.language ? getLanguageName(values.language) : undefined}
          onChange={(choice) => {
            if (choice.target.value !== "Choose a language")
              setValues({
                ...values,
                language: getLanguageCode(choice.target.value),
              });
          }}
        >
          {renderLanguageOptions("Choose a language")}
        </Form.Control>

        <div
          className={
            floorOpen ? "section__container" : "fr-fr section__container"
          }
        >
          <ToggleField
            id="isFloorOpen"
            text="This Floor is open"
            toggleOn={() => {
              setFloorOpen(true);
              setValues({ ...values, open: new Date() });
            }}
            toggleOff={() => {
              setFloorOpen(false);
              setValues({ ...values, open: new Date() });
            }}
            isChecked={floorOpen}
          />
          {floorOpen ? null : (
            <div style={{ width: "100%", justifySelf: "stretch" }}>
              <div>Set opening time</div>
              <DatePicker
                selected={values.open}
                onChange={(open) => {
                  if (
                    Object.prototype.toString.call(open) === "[object Date]"
                  ) {
                    setValues({
                      ...values,
                      open,
                    });
                  } else {
                    delete values.open;
                  }
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="input-field__input clickable"
                placeholderText="Opening (your time)"
                minDate={new Date()}
                excludeOutOfBoundsTimes
              />
            </div>
          )}
        </div>

        <Tags
          values={values}
          setValues={setValues}
          errorMessages={errorMessages}
          formError={formError}
          setFormError={setFormError}
        />
      </div>
    </div>
  );
};

export default connect(null, { checkUrlAvailability })(Basic);
