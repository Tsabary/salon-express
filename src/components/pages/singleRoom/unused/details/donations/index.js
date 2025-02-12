import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";

import validator from "validator";
import ReactTooltip from "react-tooltip";

import { AuthContext } from "../../../../../../providers/Auth";
import { updateRoom } from "../../../../../../actions/rooms";
import { updateFloorRoom } from "../../../../../../actions/floors";

import InputField from "../../../../../formComponents/inputField";
import ToggleField from "../../../../../formComponents/toggleField";
import TextArea from "../../../../../formComponents/textArea";

const Donations = ({
  room,
  roomIndex,
  floor,
  isOwner,
  updateRoom,
  updateFloorRoom,
}) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [values, setValues] = useState({});
  const [lastSavedValues, setLastSavedValues] = useState({});

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
  const [isMerchUrlEdited, setIsMerchUrlEdited] = useState(false);

  // This sets the value of the description field (so that it'll be present in our edit component)
  useEffect(() => {
    if (!room || !isOwner) return;

    if (room.donations_url) {
      setValues((val) => {
        return { ...val, donations_url: room.donations_url };
      });
      setLastSavedValues((val) => {
        return { ...val, donations_url: room.donations_url };
      });
    }

    if (room.merch_url) {
      setValues((val) => {
        return { ...val, merch_url: room.merch_url };
      });

      setLastSavedValues((val) => {
        return { ...val, merch_url: room.merch_url };
      });
    }

    if (room.donations_info) {
      setValues((val) => {
        return { ...val, donations_info: room.donations_info };
      });

      setLastSavedValues((val) => {
        return { ...val, donations_info: room.donations_info };
      });
    }
  }, [currentUserProfile, room]);

  return (
    <div className="donations details__donations section__container">
      <div className="max-max">
        <div className="section__title">Support</div>
        {isOwner ? (
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
          {isOwner ? (
            <div className="max-max">
              <div
                className="button-colored"
                onClick={() => {
                  if (
                    values.donations_url &&
                    validator.isURL(values.donations_url)
                  ) {
                    !floor
                      ? updateRoom(
                          {
                            ...room,
                            donations_url: values.donations_url,
                          },

                          "accepting donations",
                          () => {
                            setIsDonationsUrlEdited(false);
                            setLastSavedValues({
                              ...lastSavedValues,
                              donations_url: values.donations_url,
                            });
                          }
                        )
                      : updateFloorRoom(
                          {
                            ...room,
                            donations_url: values.donations_url,
                          },
                          roomIndex,
                          floor,
                          "accepting donations",
                          () => {
                            setIsDonationsUrlEdited(false);
                            setLastSavedValues({
                              ...lastSavedValues,
                              donations_url: values.donations_url,
                            });
                          }
                        );
                  } else {
                    setDonationsError("Please enter a valid url");
                  }
                }}
              >
                Save
              </div>
              <div
                className="button-colored"
                onClick={() => {
                  setValues((val) => {
                    return {
                      ...val,
                      donations_url: lastSavedValues.donations_url,
                    };
                  });
                  setIsDonationsUrlEdited(false);
                }}
              >
                Cancel
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <>
          {(room && room.donations_url && room.accepting_donations) ||
          isOwner ? (
            <a
              href={values.donations_url}
              target="_blank"
              className="boxed-button"
              rel="noopener noreferrer"
            >
              Donations
            </a>
          ) : null}

          {isOwner ? (
            <div
              className="button-colored tiny-margin-top"
              onClick={() => setIsDonationsUrlEdited(true)}
            >
              Edit Url
            </div>
          ) : null}
        </>
      )}

      {isMerchUrlEdited ? (
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
          {isOwner ? (
            <div className="max-max">
              <div
                className="button-colored"
                onClick={() => {
                  if (values.merch_url && validator.isURL(values.merch_url)) {
                    !floor
                      ? updateRoom(
                          {
                            ...room,
                            merch_url: values.merch_url,
                          },
                          "merchandise link",
                          () => {
                            setIsMerchUrlEdited(false);
                            setLastSavedValues({
                              ...lastSavedValues,
                              merch_url: values.merch_url,
                            });
                          }
                        )
                      : updateFloorRoom(
                          {
                            ...room,
                            merch_url: values.merch_url,
                          },
                          roomIndex,
                          floor,
                          "merchandise link",
                          () => {
                            setIsMerchUrlEdited(false);
                            setLastSavedValues({
                              ...lastSavedValues,
                              merch_url: values.merch_url,
                            });
                          }
                        );
                  } else {
                    setMerchError("Please enter a valid url");
                  }
                }}
              >
                Save
              </div>
              <div
                className="button-colored"
                onClick={() => {
                  setValues((val) => {
                    return {
                      ...val,
                      merch_url: lastSavedValues.merch_url,
                    };
                  });
                  setIsMerchUrlEdited(false);
                }}
              >
                Cancel
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          {(room && room.merch_url && room.selling_merch) || isOwner ? (
            <a
              href={room.merch_url}
              target="_blank"
              className="boxed-button tiny-margin-top"
              rel="noopener noreferrer"
            >
              Merchandise
            </a>
          ) : null}

          {isOwner ? (
            <div
              className="button-colored tiny-margin-top"
              onClick={() => setIsMerchUrlEdited(true)}
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
              onChange={(val) => {
                setValues({ ...values, donations_info: val });
              }}
            />
          </div>
          {isOwner ? (
            <div className="max-max">
              <div
                className="button-colored"
                onClick={() => {
                  !floor
                    ? updateRoom(
                        {
                          ...room,
                          donations_info: values.donations_info,
                        },
                        "donations details",
                        () => {
                          setIsDonationsDetailsEdited(false);
                          setLastSavedValues({
                            ...lastSavedValues,
                            donations_info: values.donations_info,
                          });
                        }
                      )
                    : updateFloorRoom(
                        {
                          ...room,
                          donations_info: values.donations_info,
                        },
                        roomIndex,
                        floor,
                        "donations details",
                        () => {
                          setIsDonationsDetailsEdited(false);
                          setLastSavedValues({
                            ...lastSavedValues,
                            donations_info: values.donations_info,
                          });
                        }
                      );
                }}
              >
                Save
              </div>

              <div
                className="button-colored"
                onClick={() => {
                  setValues((val) => {
                    return {
                      ...val,
                      donations_info: lastSavedValues.donations_info,
                    };
                  });
                  setIsDonationsDetailsEdited(false);
                }}
              >
                Cancel
              </div>
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

          {isOwner ? (
            <div
              className="button-colored tiny-margin-top"
              onClick={() => setIsDonationsDetailsEdited(true)}
            >
              Edit Details
            </div>
          ) : null}
        </>
      )}

      {room && room.donations_url && isOwner ? (
        <ToggleField
          id="acceptingDonationsToggle"
          text="Currently accepting donations"
          toggleOn={() =>
            !floor
              ? updateRoom(
                  {
                    ...room,
                    accepting_donations: true,
                  },
                  "Enabled donations",
                  () => console.log("Enabled donations")
                )
              : updateFloorRoom(
                  {
                    ...room,
                    accepting_donations: true,
                  },
                  roomIndex,
                  floor,
                  "Enabled donations",
                  () => console.log("Enabled donations")
                )
          }
          toggleOff={() =>
            !floor
              ? updateRoom(
                  {
                    ...room,
                    accepting_donations: false,
                  },
                  "Dissabled donations",
                  () => console.log("Dissabled donations")
                )
              : updateFloorRoom(
                  {
                    ...room,
                    accepting_donations: false,
                  },
                  roomIndex,
                  floor,
                  "Dissabled donations",
                  () => console.log("Dissabled donations")
                )
          }
          isChecked={room.accepting_donations}
        />
      ) : null}

      {room && room.merch_url && isOwner ? (
        <ToggleField
          id="sellingMerchToggle"
          text="Currently selling merchandise"
          toggleOn={() =>
            !floor
              ? updateRoom(
                  {
                    ...room,
                    selling_merch: true,
                  },
                  "Enabled merchandise",
                  () => console.log("Enabled merchandise")
                )
              : updateFloorRoom(
                  {
                    ...room,
                    selling_merch: true,
                  },
                  roomIndex,
                  floor,
                  "Enabled donations",
                  () => console.log("Enabled merchandise")
                )
          }
          toggleOff={() =>
            !floor
              ? updateRoom(
                  {
                    ...room,
                    selling_merch: false,
                  },
                  "Dissabled donations",
                  () => console.log("Dissabled merchandise")
                )
              : updateFloorRoom(
                  {
                    ...room,
                    selling_merch: false,
                  },
                  roomIndex,
                  floor,
                  "Dissabled donations",
                  () => console.log("Dissabled merchandise")
                )
          }
          isChecked={room.selling_merch}
        />
      ) : null}
    </div>
  );
};

export default connect(null, { updateRoom, updateFloorRoom })(Donations);
