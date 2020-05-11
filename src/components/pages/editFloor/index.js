import "./styles.scss";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  ImageWithZoom,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

import history from "../../../history";

import { fetchFloor, saveFloor, checkUrlAvailability } from "../../../actions";

import InputField from "../../formComponents/inputField";
import Tags from "../../formComponents/tags";
import SingleEditRoom from "./singleEditRoom";

import { validateWordsLength } from "../../../utils/strings";
import {
  getLanguageName,
  getLanguageCode,
  renderLanguageOptions,
} from "../../../utils/languages";
import { checkValidity, errorMessages } from "../../../utils/forms";
import ToggleField from "../../formComponents/toggleField";
import TextArea from "../../formComponents/textArea";
import validator from "validator";

const EditFloor = ({
  match,
  myFloors,
  floorPlans,
  fetchFloor,
  saveFloor,
  checkUrlAvailability,
}) => {
  const myHistory = useHistory(history);

  const [floor, setFloor] = useState(null);
  const [chosenPlan, setChosenPlan] = useState(null);
  const [values, setValues] = useState({});
  const [formError, setFormError] = useState(null);
  const [urlError, setUrlError] = useState(null);
  const [urlApproved, setUrlApproved] = useState(false);
  const [urlButton, setUrlButton] = useState("Check Availability");
  const [floorOpen, setFloorOpen] = useState(true);
  const [tempUrl, setTempUrl] = useState("");
  const [newAdmin, setNewAdmin] = useState("");

  const [tracks, setTracks] = useState({});

  const [rooms, setRooms] = useState({});

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageAsFile, setImageAsFile] = useState("");

  useEffect(() => {
    if (!chosenPlan) return;
    chosenPlan.rooms.forEach((r, index) => {
      setRooms((ro) => {
        return {
          ...ro,
          [index]: { ...ro[index], shape: r.shape, coords: r.coords },
        };
      });
    });
  }, [chosenPlan]);

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

  useEffect(() => {
    const thisFloor = myFloors.filter(
      (floor) => floor.id === match.params.id
    )[0];

    !thisFloor ? fetchFloor(match.params.id) : setFloor(thisFloor);
  }, [match.params.id, myFloors]);

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile(() => image);
    setSelectedImage(URL.createObjectURL(image));
  };

  const renderSildes = (plans) => {
    return plans.map((plan, index) => {
      return (
        <Slide index={index} key={index}>
          <ImageWithZoom
            src={plan.image}
            className="clickable extra-tiny-margin-right"
            onClick={() => {
              setChosenPlan(plan);
              setValues((val) => {
                return {
                  ...val,
                  // rooms: plan.rooms,
                  image: plan.image,
                };
              });
            }}
          />
        </Slide>
      );
    });
  };

  const renderRooms = (chosenPlan, roomsArray) => {
    return chosenPlan.rooms.map((room, index) => {
      return (
        <SingleEditRoom
          room={room}
          rooms={rooms}
          setRooms={setRooms}
          roomsArray={roomsArray}
          setTracks={setTracks}
          index={index}
          key={index}
        />
      );
    });
  };

  const handleSave = () => {
    // Chck values somehow //
    const newFloor = { ...values, rooms };
    saveFloor(
      newFloor,
      imageAsFile,
      tracks,
      () => {
        myHistory.push(`/floor-management`);
        console.log("admins", "newFloor.admins")

      },
      (e) => console.error(e)
    );
  };

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
    <div className="edit-floor">
      <div className="edit-floor__basic">
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
            <div className="fr-max">
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
              value={
                values.language ? getLanguageName(values.language) : undefined
              }
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

        <div>
          <div className="edit-floor__section">
            <div className="edit-floor__section-title">Add your logo</div>
            <span>
              <label
                htmlFor="edit-floor-logo"
                className="new-floor-plan__image-container"
              >
                <img
                  className="new-floor-plan__image-preview clickable"
                  src={
                    selectedImage ||
                    (values && values.logo) ||
                    "../../imgs/placeholder.jpg"
                  }
                  alt="Logo"
                />
              </label>
              <input
                id="edit-floor-logo"
                className="update-profile__upload"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageAsFile}
              />
            </span>
          </div>
          <div className="edit-floor__section">
            <div className="edit-floor__section-title">Admins</div>
            <div className="fr-max">
              <InputField
                type="text"
                placeHolder="Add an admin"
                value={newAdmin}
                onChange={setNewAdmin}
              />
              <div
                className="small-button"
                onClick={() => {
                  if (validator.isEmail(newAdmin)) {
                    setValues({
                      ...values,
                      admins: [...values.admins, newAdmin],
                    });

                    setNewAdmin("");
                  }
                }}
              >
                Add
              </div>
            </div>
            <div className="edit-floor__admins">
              {values && values.admins
                ? values.admins.map((ad) => {
                    return (
                      <div className="edit-floor__admin" key={ad}>
                        {ad}
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
      </div>

      {/** Choose Floor plan */}
      <div className="edit-floor__section">
        <div className="edit-floor__section-title">Choose your floor plan</div>
        <div className="edit-floor__plans">
          <CarouselProvider
            naturalSlideWidth={12}
            naturalSlideHeight={9}
            totalSlides={
              floorPlans && floorPlans.length ? floorPlans.length : 0
            }
            visibleSlides={
              !floorPlans
                ? 0
                : !floorPlans.length
                ? 0
                : floorPlans.length > 3
                ? 3
                : floorPlans.length
            }
            hasMasterSpinner
          >
            {floorPlans ? (
              <Slider className="new-floor__carousel">
                {renderSildes(floorPlans)}
              </Slider>
            ) : null}
            <div className="max-fr-max tiny-margin-top">
              <ButtonBack className="small-button">Back</ButtonBack>
              <div className="centered-text new-floor__choose">
                Choose a Floor plan
              </div>
              <ButtonNext className="small-button">Next</ButtonNext>
            </div>
          </CarouselProvider>

          <div className="edit-floor__current-plan">
            <img
              className="new-floor-plan__image-preview"
              src={
                (chosenPlan && chosenPlan.image) ||
                (values && values.image) ||
                "../../../imgs/placeholder.jpg"
              }
              alt="Floor plan"
            />
          </div>
        </div>
      </div>

      <div className="edit-floor__section">
        <div className="edit-floor__section-title">Set Rooms</div>
        {rooms && chosenPlan ? (
          <div className="edit-floor__rooms">
            {renderRooms(chosenPlan, rooms)}
          </div>
        ) : null}
      </div>

      <div className="boxed-button small-margin-top" onClick={handleSave}>
        Save
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    myFloors: state.myFloors,
    floorPlans: state.floorPlans,
  };
};

export default connect(mapStateToProps, {
  fetchFloor,
  saveFloor,
  checkUrlAvailability,
})(EditFloor);
