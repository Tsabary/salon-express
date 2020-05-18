import "./styles.scss";
import React, { useContext, useState, useEffect } from "react";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import Form from "react-bootstrap/Form";

import { AuthContext } from "../../../providers/Auth";

import { addFloorPlan } from "../../../actions/floors";

import InputField from "../../formComponents/inputField";

const NewFloorPlan = ({ addFloorPlan }) => {
  const { currentUserProfile, setCurrentUserProfile, currentUser } = useContext(
    AuthContext
  );
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({ shape: "rect", coords: [] });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [coordsFormError, setCoordsFormError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageAsFile, setImageAsFile] = useState("");

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile(() => image);
    setSelectedImage(URL.createObjectURL(image));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(rooms);

    switch (true) {
      case !currentUserProfile:
        setFormError("Please log in to upload a Floor plan");
        break;

      case !imageAsFile:
        setFormError("Please upload your Floor plan's image");
        break;

      case imageAsFile.size > 2000000:
        setFormError("Floor plan's image can't be bigger than 2mb");
        break;

      case rooms.length < 2:
        setFormError("Floor plans need to have at least 2 Rooms");
        break;

      default:
        setFormError(null);
        setSubmitting(true);
        addFloorPlan(
          { user_ID: currentUserProfile.uid, rooms },
          imageAsFile,
          () => {
            setSubmitting(false);
            window.location.hash = "";
          }
        );
    }
  };

  const renderRooms = (ro) => {
    return ro.map((r, i) => {
      return (
        <div className="section__container" key={i}>
          <div className="section__title">{`Room ${i + 1} (${
            r.shape === "rect"
              ? "Rectangle"
              : r.shape === "circle"
              ? "Circle"
              : "Polygon"
          })`}</div>

          <div>{r.coords.join(", ")}</div>
        </div>
      );
    });
  };

  const getShape = (val) => {
    switch (val) {
      case "Rectangle":
        return "rect";

      case "Circle":
        return "circle";

      case "Polygon":
        return "poly";
    }
  };

  const getShapeName = (val) => {
    switch (val) {
      case "rect":
        return "Rectangle";

      case "circle":
        return "Circle";

      case "poly":
        return "Polygon";
    }
  };

  const validateShapeCoords = (coords, shape) => {
    switch (shape) {
      case "rect":
        if (coords.length !== 4) {
          setCoordsFormError(
            `A rectangle requires exactly 4 coordinates, and you've entered ${coords.length}. Please check your input.`
          );
          return false;
        }
        setCoordsFormError(null);
        return true;

      case "circle":
        if (coords.length !== 3) {
          setCoordsFormError(
            `A circle requires exactly 3 coordinates, and you've entered ${coords.length}. Please check your input.`
          );
          return false;
        }
        setCoordsFormError(null);
        return true;

      case "poly":
        if (coords.length < 3) {
          setCoordsFormError(
            `A polygon requires at least 3 coordinates, and you've entered ${coords.length}. Please check your input.`
          );
          return false;
        }
        setCoordsFormError(null);
        return true;
    }
  };

  return (
    <div className="popup" id="add-floor-plan">
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
          <div className="popup__title">Upload a Floor plan</div>
          <div className="new-floor-plan__body small-margin-top">
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="new-floor-plan__top">
                <span>
                  <label
                    htmlFor="new-floor-plan-image"
                    className="new-floor-plan__image-container"
                  >
                    <img
                      className="new-floor-plan__image-preview clickable"
                      src={selectedImage || "../../imgs/placeholder.jpg"}
                      alt="Profile"
                    />
                  </label>
                  <input
                    id="new-floor-plan-image"
                    className="update-profile__upload"
                    type="file"
                    onChange={handleImageAsFile}
                  />
                </span>
              </div>

              <div className="update-profile__fields">
                <div className="max-fr-max">
                  <Form.Control
                    as="select"
                    bsPrefix="input-field__input form-drop"
                    value={getShapeName(newRoom.shape)}
                    onChange={(choice) =>
                      setNewRoom({
                        ...newRoom,
                        shape: getShape(choice.target.value),
                      })
                    }
                  >
                    <option className="form-drop" key="rect">
                      Rectangle
                    </option>
                    <option className="form-drop" key="circle">
                      Circle
                    </option>
                    <option className="form-drop" key="poly">
                      Polygon
                    </option>
                  </Form.Control>

                  <InputField
                    type="text"
                    placeHolder="Room coords"
                    value={newRoom.coords}
                    onChange={(coords) => {
                      setNewRoom({ ...newRoom, coords: coords.trim() });
                    }}
                  />
                  <div
                    className="audio-settings__add"
                    onClick={() => {
                      const coords = newRoom.coords
                        .split(",")
                        .map((coord) => parseInt(coord, 10))
                        .filter((el) => !!el);

                      if (!validateShapeCoords(coords, newRoom.shape)) return;
                      setRooms([
                        ...rooms,
                        {
                          shape: newRoom.shape,
                          coords,
                        },
                      ]);
                      setNewRoom({...newRoom, coords: []});
                    }}
                  >
                    +
                  </div>
                </div>

                {coordsFormError ? (
                  <div
                    className="form-error tiny-margin-top"
                    style={{ textAlign: "center" }}
                  >
                    {coordsFormError}
                  </div>
                ) : null}

                {renderRooms(rooms)}
                {/* Number of rooms {rooms.length} */}
              </div>

              {formError ? (
                <div
                  className="form-error tiny-margin-top"
                  style={{ textAlign: "center" }}
                >
                  {formError}
                </div>
              ) : null}

              <div className="popup__button tiny-margin-top">
                <button type="submit" className="boxed-button">
                  Add Floor Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="centered">
          <Loader type="Grid" color="#6f00ff" height={100} width={100} />
        </div>
      )}
    </div>
  );
};

export default connect(null, { addFloorPlan })(NewFloorPlan);
