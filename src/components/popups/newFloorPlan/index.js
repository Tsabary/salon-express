import "./styles.scss";
import React, { useContext, useState } from "react";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";

import { AuthContext } from "../../../providers/Auth";

import { addFloorPlan } from "../../../actions";

import InputField from "../../formComponents/inputField";

const NewFloorPlan = ({ addFloorPlan }) => {
  const { currentUserProfile, setCurrentUserProfile, currentUser } = useContext(
    AuthContext
  );
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageAsFile, setImageAsFile] = useState("");

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile(() => image);
    setSelectedImage(URL.createObjectURL(image));
  };

  const handleSubmit = () => {
    setSubmitting(true);

    addFloorPlan(rooms, imageAsFile, () => {
      setSubmitting(false);
    });
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
          <div className="new-floor-plan__body">
            <form onSubmit={handleSubmit}>
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
                <div className="fr-max">
                  <InputField
                    type="text"
                    placeHolder="Room coords"
                    value={newRoom}
                    onChange={(coords) => {
                      setNewRoom(coords.trim());
                    }}
                  />
                  <div
                    className="audio-settings__add"
                    onClick={() => {
                      setRooms([
                        ...rooms,
                        {
                          shape: "rect",
                          coords: newRoom
                            .split(",")
                            .map((coord) => parseInt(coord, 10)),
                        },
                      ]);
                      setNewRoom("");
                    }}
                  >
                    +
                  </div>
                </div>
                Number of rooms {rooms.length}
              </div>

              <div className="popup__button small-margin-top">
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
