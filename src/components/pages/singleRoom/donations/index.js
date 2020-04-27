import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";

import validator from "validator";
import ReactTooltip from "react-tooltip";

import { AuthContext } from "../../../../providers/Auth";
import { updateRoom } from "../../../../actions";

import InputField from "../../../formComponents/inputField";
import ToggleField from "../../../formComponents/toggleField";
import TextArea from "../../../formComponents/textArea";

const Donations = ({ room, updateRoom }) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [values, setValues] = useState({});

  // This holdes the donations error if any ("Not a valid URL")
  const [donationsError, setDonationsError] = useState(null);

  // This holdes the donations error if any ("Not a valid URL")
  const [merchError, setMerchError] = useState(null);

  // These are controllers for the different containers - do we show the static or the edit mode
  const [isDonationsUrlEdited, setIsDonationsUrlEdited] = useState(false);

  // These are controllers for the different containers - do we show the static or the edit mode
  const [isDonationsDetailsEdited, setIsDonationsDetailsEdited] = useState(
    false
  );

  // These are controllers for the different containers - do we show the static or the edit mode
  const [isMerchDetailsEdited, setIsMerchDetailsEdited] = useState(false);

  // This sets the value of the description field (so that it'll be present in our edit component)
  useEffect(() => {
    if (
      !room ||
      !currentUserProfile ||
      !currentUserProfile.uid ||
      room.user_ID !== currentUserProfile.uid
    )
      return;

    if (room.donations_url)
      setValues((val) => {
        return { ...val, donations_url: room.donations_url };
      });

    if (room.merch_url)
      setValues((val) => {
        return { ...val, merch_url: room.merch_url };
      });

    if (room.donations_info)
      setValues((val) => {
        return { ...val, donations_info: room.donations_info };
      });
  }, [currentUserProfile, room]);

  return (
    <div className="section__container single-room__container-donations donations">
      <div className="max-max">
        <div className="section__title">Link for Donations</div>
        {currentUserProfile &&
        room &&
        currentUserProfile.uid === room.user_ID ? (
          <>
            <div
              className="info clickable"
              data-tip="acceptingDonationsTooltip"
              data-for="acceptingDonationsTooltip"
            />
            <ReactTooltip id="acceptingDonationsTooltip">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    "Accepting donations?<br />Drop your forwarding link here.",
                }}
              />
            </ReactTooltip>
          </>
        ) : null}
      </div>

      {isDonationsUrlEdited ? (
        <>
          <div className="tiny-margin-bottom">
            <InputField
              type="text"
              placeHolder="Link for donations"
              value={values && values.donations_url}
              onChange={(val) => setValues({ ...values, donations_url: val })}
            />
          </div>
          {donationsError ? donationsError : null}
          {currentUserProfile &&
          room &&
          currentUserProfile.uid === room.user_ID ? (
            <div
              className="button-colored"
              onClick={() => {
                if (
                  values.donations_url &&
                  validator.isURL(values.donations_url)
                ) {
                  updateRoom(
                    {
                      ...room,
                      donations_url: values.donations_url,
                    },
                    "accepting donations",
                    () => {
                      setIsDonationsUrlEdited(false);
                    }
                  );
                } else {
                  setDonationsError("Please enter a valid url");
                }
              }}
            >
              Save
            </div>
          ) : null}
        </>
      ) : (
        <>
          <a
            href={values.donations_url}
            target="_blank"
              className="boxed-button"
              rel="noopener noreferrer"
          >
            Donations
          </a>

          {currentUserProfile &&
          room &&
          currentUserProfile.uid === room.user_ID ? (
            <div
              className="button-colored tiny-margin-top"
              onClick={() => setIsDonationsUrlEdited(true)}
            >
              Edit Url
            </div>
          ) : null}
        </>
      )}

      {isMerchDetailsEdited ? (
        <div className="small-margin-top">
          <div className="tiny-margin-bottom">
            <InputField
              type="text"
              placeHolder="Link for merchandise"
              value={values && values.merch_url}
              onChange={(val) => setValues({ ...values, merch_url: val })}
            />
          </div>
          {merchError ? merchError : null}
          {currentUserProfile &&
          room &&
          currentUserProfile.uid === room.user_ID ? (
            <div
              className="button-colored"
              onClick={() => {
                if (values.merch_url && validator.isURL(values.merch_url)) {
                  updateRoom(
                    {
                      ...room,
                      merch_url: values.merch_url,
                    },
                    "merchandise link",
                    () => {
                      setIsMerchDetailsEdited(false);
                    }
                  );
                } else {
                  setMerchError("Please enter a valid url");
                }
              }}
            >
              Save
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <a
            href={room.merch_url}
            target="_blank"
              className="boxed-button tiny-margin-top"
              rel="noopener noreferrer"
          >
            Merchandise
          </a>

          {currentUserProfile &&
          room &&
          currentUserProfile.uid === room.user_ID ? (
            <div
              className="button-colored tiny-margin-top"
              onClick={() => setIsMerchDetailsEdited(true)}
            >
              Edit Url
            </div>
          ) : null}
        </>
      )}

      {isDonationsDetailsEdited ? (
        <>
          <div className="tiny-margin-bottom">
            <TextArea
              type="text"
              placeHolder="Add some details explaining why you're collecting tips"
              value={values && values.donations_info}
              onChange={(val) => setValues({ ...values, donations_info: val })}
            />
          </div>
          {currentUserProfile &&
          room &&
          currentUserProfile.uid === room.user_ID ? (
            <div
              className="button-colored"
              onClick={() => {
                if (values.donations_info) {
                  updateRoom(
                    {
                      ...room,
                      donations_info: values.donations_info,
                    },
                    "donations details",
                    () => {
                      setIsDonationsDetailsEdited(false);
                    }
                  );
                }
              }}
            >
              Save
            </div>
          ) : null}
        </>
      ) : (
        <>
          {values && values.donations_info ? (
            <div className="donations__info tiny-margin-top ">
              {values && values.donations_info}
            </div>
          ) : null}

          {currentUserProfile &&
          room &&
          currentUserProfile.uid === room.user_ID ? (
            <div
              className="button-colored tiny-margin-top"
              onClick={() => setIsDonationsDetailsEdited(true)}
            >
              Edit Details
            </div>
          ) : null}
        </>
      )}

      {room &&
      room.donations_url &&
      currentUserProfile &&
      currentUserProfile.uid === room.user_ID ? (
        <ToggleField
          id="acceptingDonationsToggle"
          text="Currently accepting donations"
          toggleOn={() =>
            updateRoom(
              {
                ...room,
                accepting_donations: true,
              },
              "Enabled donations",
              () => console.log("Enabled donations")
            )
          }
          toggleOff={() =>
            updateRoom(
              {
                ...room,
                accepting_donations: false,
              },
              "Dissabled donations",
              () => console.log("Dissabled donations")
            )
          }
          isChecked={room.accepting_donations}
        />
      ) : null}
    </div>
  );
};

export default connect(null, { updateRoom })(Donations);
