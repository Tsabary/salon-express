import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { ReactSVG } from "react-svg";
import { connect } from "react-redux";

import { RoomContext } from "../../../../providers/Room";

import { updateRoom, addImageToRoom } from "../../../../actions/rooms";
import { addImageToFloorRoom } from "../../../../actions/floors";
import { fetchTags } from "../../../../actions/global";

import { errorMessages } from "../../../../utils/forms";

import InputField from "../../../formComponents/inputField";
import TextArea from "../../../formComponents/textArea";
import Tags from "../../../formComponents/tags";
import { validateWordsLength } from "../../../../utils/strings";
import { FloorContext } from "../../../../providers/Floor";

const EditSlider = ({
  room,
  roomIndex,
  floor,
  isRoomEdited,
  setIsRoomEdited,
  tags,
  addImageToRoom,
  addImageToFloorRoom,
  updateRoom,
  fetchTags,
}) => {
  const { setGlobalRoom } = useContext(RoomContext);
  const { setGlobalFloorRoom } = useContext(FloorContext);

  const [values, setValues] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageAsFile, setImageAsFile] = useState(null);

  const [imageError, setImageError] = useState(null);
  const [tagsFormError, setTagsFormError] = useState("");

  useEffect(() => {
    if (!tags.length) fetchTags();
  }, [tags]);

  useEffect(() => {
    if (!room) {
      setImageAsFile(null);
      setSelectedImage(null);
    }
  }, [room]);

  useEffect(() => {
    if (!room) return;
    setValues(room);
  }, [room]);

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];

    if (image && image.size > 500000) {
      setImageError("Maximum image size is 500kb");
      return;
    }

    setImageAsFile(() => image);
    setSelectedImage(URL.createObjectURL(image));
  };

  const handleImageUpload = () => {
    floor
      ? addImageToFloorRoom(room, roomIndex, floor, imageAsFile, (updRoom) => {
          setGlobalFloorRoom(updRoom);
          setImageAsFile(null);
          setSelectedImage(null);
        })
      : addImageToRoom(room, imageAsFile, (updRoom) => {
          setGlobalRoom(updRoom);
          setImageAsFile(null);
          // setSelectedImage(null);
        });
  };

  return room ? (
    <div className="edit-slider">
      <input
        type="checkbox"
        className="edit-slider__checkbox"
        id="edit-slider-toggle"
        checked={isRoomEdited}
        readOnly
      />
      <div className="edit-slider__content">
        <div
          className="fr-max small-margin-bottom"
          style={{ fontSize: "2rem", color: "#ababab" }}
        >
          <div>Edit Room</div>
          <div className="clickable" onClick={() => setIsRoomEdited(false)}>
            ✖
          </div>
        </div>

        <div className="edit-slider__image">
          <label
            htmlFor={`edit-slider-image-${room.id}`}
            className="edit-slider__image-container"
          >
            <img
              className="edit-slider__image-preview clickable"
              src={
                selectedImage ||
                (floor &&
                  floor.rooms &&
                  floor.rooms[roomIndex] &&
                  floor.rooms[roomIndex].image) ||
                room.image ||
                "../../imgs/placeholder.jpg"
              }
              alt="Room"
            />
          </label>

          <input
            id={`edit-slider-image-${room.id}`}
            className="invisible"
            type="file"
            onChange={handleImageAsFile}
          />

          {imageAsFile ? (
            <div className="edit-slider__image-btn edit-slider__image-approve">
              <ReactSVG
                src="../../svgs/check.svg"
                wrapper="div"
                beforeInjection={(svg) => {
                  svg.classList.add("svg-icon--normal");
                }}
                onClick={handleImageUpload}
              />
            </div>
          ) : null}

          {imageAsFile ? (
            <div className="edit-slider__image-btn edit-slider__image-cancel">
              <ReactSVG
                src="../../svgs/x.svg"
                wrapper="div"
                beforeInjection={(svg) => {
                  svg.classList.add("svg-icon--normal");
                }}
                onClick={() => {
                  setImageAsFile(null);
                  setSelectedImage(null);
                }}
              />
            </div>
          ) : null}

          {imageError ? <div className="form-error">{imageError}</div> : null}
        </div>

        <InputField
          type="text"
          placeHolder="Room name"
          value={values && values.name}
          onChange={(name) => {
            if (name.length < 80 && validateWordsLength(name, 25))
              setValues({ ...values, name });
          }}
          className="tiny-margin-top"
        />

        <TextArea
          type="text"
          placeHolder="Describe what this Room is about"
          value={values && values.description}
          onChange={(val) => {
            if (val.length < 600) setValues({ ...values, description: val });
          }}
          className="tiny-margin-top"
        />

        {!floor ? (
          <Tags
            tags={tags}
            values={values}
            setValues={setValues}
            field="tags"
            errorMessages={errorMessages}
            formError={tagsFormError}
            setFormError={setTagsFormError}
            placeHolder="Add 2-5 tags that are related to this Room"
            className="tiny-margin-top"
          />
        ) : null}

        <div
          className="small-button tiny-margin-top"
          onClick={() =>
            updateRoom(values, (ro) => {
              setIsRoomEdited(false);
              setGlobalRoom(ro);
            })
          }
        >
          Save changes
        </div>
      </div>
    </div>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    tags: state.tags,
  };
};

export default connect(mapStateToProps, {
  addImageToRoom,
  addImageToFloorRoom,
  updateRoom,
  fetchTags,
})(EditSlider);
