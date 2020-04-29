import "./styles.scss";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";
import Form from "react-bootstrap/Form";

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

import { fetchFloor, saveFloor } from "../../../actions";

import InputField from "../../formComponents/inputField";
import TextArea from "../../formComponents/textArea";
import Tags from "../../formComponents/tags";

import { validateWordsLength } from "../../../utils/strings";
import {
  getLanguageName,
  getLanguageCode,
  renderLanguageOptions,
} from "../../../utils/languages";
import { checkValidity, errorMessages } from "../../../utils/forms";

const EditFloor = ({ match, myFloors, floorPlans, fetchFloor, saveFloor }) => {
  const myHistory = useHistory(history);

  const [floor, setFloor] = useState(null);
  const [chosenPlan, setChosenPlan] = useState(null);
  const [values, setValues] = useState({});
  const [formError, setFormError] = useState(null);

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
    console.log("brrrrrraa", e);
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
        <div key={index}>
          <div className="extra-tiny-margin-bottom">Room {index + 1}</div>
          <InputField
            type="text"
            placeHolder="Room name"
            value={roomsArray[index] && roomsArray[index].name}
            onChange={(name) =>
              setRooms({
                ...rooms,
                [index]: {
                  ...rooms[index],
                  name,
                  coords: room.coords,
                  shape: room.shape,
                  id: room.id ? room.id : uuidv4(),
                },
              })
            }
          />
          <div className="extra-tiny-margin-top">
            <TextArea
              type="text"
              placeHolder="Room description"
              value={roomsArray[index] && roomsArray[index].description}
              onChange={(description) =>
                setRooms({
                  ...rooms,
                  [index]: { ...rooms[index], description },
                })
              }
            />
          </div>
        </div>
      );
    });
  };

  const handleSave = () => {
    // Chck values somehow //
    const newFloor = { ...values, rooms };
    saveFloor(newFloor, imageAsFile, () => myHistory.push(`/floor-management`));
  };

  return (
    <div className="edit-floor">
      <div className="edit-floor__basic-and_logo">
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

            <Form.Control
              as="select"
              bsPrefix="input-field__input form-drop tiny-margin-bottom"
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

            <Tags
              values={values}
              setValues={setValues}
              errorMessages={errorMessages}
              formError={formError}
              setFormError={setFormError}
            />
          </div>
        </div>
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
              onChange={handleImageAsFile}
            />
          </span>
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

export default connect(mapStateToProps, { fetchFloor, saveFloor })(EditFloor);
