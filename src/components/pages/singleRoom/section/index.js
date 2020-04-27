import "./styles.scss";
import React from "react";

import ReactTooltip from "react-tooltip";
import validator from "validator";

import { updateRoom } from "../../../../actions";

import InputField from "../../../formComponents/inputField";
import TextArea from "../../../formComponents/textArea";
import ToggleField from "../../../formComponents/toggleField";
import { connect } from "react-redux";

const Section = ({
  currentUserProfile,
  room,
  values,
  setValues,
  analyticsTag,
  visibilityConditionField,
  field,
  title,
  moreText,
  isInEditMode,
  setIsInEditMode,
  tooltipId,
  tooltipText,
  inputType,
  inputPlaceholder,
  formError,
  setFormError,
  isUrl,
  toggleID,
  toggleText,
  toggleOn,
  toggleOff,
  toggleDefault,
  updateRoom,
}) => {
  return (room && room[visibilityConditionField]) ||
    (currentUserProfile && room && currentUserProfile.uid === room.user_ID) ? (
    <div className="section__container">
      <div className="max-max">
        <div className="section__title">{title}</div>
        {tooltipId &&
        currentUserProfile &&
        room &&
        currentUserProfile.uid === room.user_ID ? (
          <>
            <div
              className="info clickable"
              data-tip={tooltipId}
              data-for={tooltipId}
            />
            <ReactTooltip id={tooltipId}>
              <div dangerouslySetInnerHTML={{ __html: tooltipText }} />
            </ReactTooltip>
          </>
        ) : null}
      </div>

      {isInEditMode ? (
        <>
          <div className="tiny-margin-bottom">
            {inputType === "text" ? (
              <InputField
                type="text"
                placeHolder={inputPlaceholder}
                value={values && values[field]}
                onChange={(val) => setValues({ ...values, [field]: val })}
              />
            ) : (
              <TextArea
                type="text"
                placeHolder={inputPlaceholder}
                value={values && values[field]}
                onChange={(val) => setValues({ ...values, [field]: val })}
              />
            )}
          </div>
          {formError ? formError : null}
          {currentUserProfile &&
          room &&
          currentUserProfile.uid === room.user_ID ? (
            <div
              className="button-colored"
              onClick={() => {
                if (
                  values[field] &&
                  (isUrl ? validator.isURL(values[field]) : true)
                ) {
                  updateRoom(
                    {
                      ...room,
                      [field]: values[field],
                    },
                    { analyticsTag },
                    () => {
                      setIsInEditMode(false);
                    }
                  );
                } else {
                  setFormError("Please enter a valid url");
                }
              }}
            >
              Save
            </div>
          ) : null}

        </>
      ) : (
        <>
          {!room || (room && !room[field]) ? (
            ""
          ) : isUrl ? (
            <a href={room[field]} target="_blank" className="boxed-button" rel="noopener noreferrer">
              Donations
            </a>
          ) : (
            <div>{room[field]}</div>
          )}
          {moreText ? <div className="tiny-margin-top">{moreText}</div> : null}

          {currentUserProfile &&
          room &&
          currentUserProfile.uid === room.user_ID ? (
            <div
              className="button-colored tiny-margin-top"
              onClick={() => setIsInEditMode(true)}
            >
              Edit
            </div>
          ) : null}
          {toggleID &&
          room &&
          room[field] &&
          currentUserProfile &&
          currentUserProfile.uid === room.user_ID ? (
            <ToggleField
              id={toggleID}
              text={toggleText}
              toggleOn={toggleOn}
              toggleOff={toggleOff}
              isChecked={room[toggleDefault]}
            />
          ) : null}
        </>
      )}
    </div>
  ) : null;
};

export default connect(null, { updateRoom })(Section);
