import "./styles.scss";
import React, { useState, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";

import TextArea from "../../../../formComponents/textArea";
import InputField from "../../../../formComponents/inputField";

const SingleEditRoom = ({
  index,
  room,
  rooms,
  setRooms,
  roomsArray,
  setTracks,
}) => {
  const [trackUploaded, setTrackUploaded] = useState(false);
  const [uploadButton, setUploadButton] = useState("Background sound on hover");

  useEffect(() => {
    if (room.track) setUploadButton(room.track.name);
  }, [room]);

  const handleFileUpload = (file) => {
    setTrackUploaded(true);
    setUploadButton(file[0].name.substring(0, 20) + "...");
    setTracks((tracks) => {
      return { ...tracks, [index]: file[0] };
    });
  };

  return (
    <div className="single-edit-room">
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
      <div className="extra-tiny-margin-top">
        <label
          htmlFor={`upload-track-${index}`}
          className="apply__upload-label"
        >
          <div className="boxed-button">{uploadButton}</div>
          {trackUploaded ? "File Added Succefully!" : null}
        </label>
        <input
          id={`upload-track-${index}`}
          className="apply__upload-input"
          type="file"
          accept=".mp3,.wav"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
      </div>
    </div>
  );
};

export default SingleEditRoom;
