import "./styles.scss";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../../../providers/Auth";
import validator from "validator";
import Form from "react-bootstrap/Form";

import ReactTooltip from "react-tooltip";

import { updateRoom, addChannel } from "../../../../actions";
import { connect } from "react-redux";

import InputField from "../../../formComponents/inputField";
import SingleChannel from "./singleChannel";

const AudioSettings = ({
  audioChannels,
  addChannel,
  room,
  currentAudioChannel,
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const [newChannel, setNewChannel] = useState(null);

  const renderChannels = (channels) => {
    return channels.map((channel) => {
      return (
        <SingleChannel
          channel={channel}
          room={room}
          currentAudioChannel={currentAudioChannel}
          key={channel.id}
        />
      );
    });
  };

  const renderIdInput = (newChannel) => {
    if (!newChannel || (newChannel && !newChannel.source)) return;

    switch (newChannel.source) {
      case "Mixlr":
        return (
          <InputField
            type="text"
            placeHolder="Mixlr ID"
            value={newChannel && newChannel.link}
            onChange={(link) => {
              setNewChannel({ ...newChannel, link });
            }}
            isNumber
          />
        );

      case "Youtube":
        return (
          <InputField
            type="text"
            placeHolder="Stream ID"
            value={newChannel && newChannel.link}
            onChange={(link) => {
              setNewChannel({ ...newChannel, link });
            }}
            numbersAndLetters
          />
        );

      case "Twitch":
        return (
          <InputField
            type="text"
            placeHolder="Channel ID"
            value={newChannel && newChannel.link}
            onChange={(link) => {
              setNewChannel({ ...newChannel, link });
            }}
            numbersAndLetters
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="section__container">
      <div className="max-max">
        <div className="section__title">Audio Settings</div>

        <>
          <div
            className="info clickable"
            data-tip="audioSettings"
            data-for="audioSettings"
          />
          <ReactTooltip id="audioSettings">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  "Paste here your Mixlr ID only.<br />Click for more details.",
              }}
            />
          </ReactTooltip>
        </>
      </div>

      <form autoComplete="off" onSubmit={() => addChannel(newChannel, room)}>
        <div className="fr-max">
          <div>
            <InputField
              type="text"
              placeHolder="Name"
              value={newChannel && newChannel.title}
              onChange={(title) => {
                setNewChannel({
                  ...newChannel,
                  title: title
                    .replace(/^([^-]*-)|-/g, "$1")
                    .replace(/[^\p{L}\s\d-]+/gu, ""),
                });
              }}
            />
            <Form.Control
              as="select"
              bsPrefix="input-field__input form-drop extra-tiny-margin-top extra-tiny-margin-bottom"
              value={
                newChannel && newChannel.source ? newChannel.source : undefined
              }
              onChange={(choice) => {
                console.log("mine", choice.target.value);
                setNewChannel({
                  ...newChannel,
                  source: choice.target.value,
                });
              }}
            >
              <option className="form-drop__default">Pick a Source</option>
              <option className="form-drop">Twitch</option>
              <option className="form-drop">Youtube</option>
              <option className="form-drop">Mixlr</option>
            </Form.Control>

            {renderIdInput(newChannel)}
          </div>
          <button type="submit" className="audio-settings__add">
            +
          </button>
        </div>
      </form>

      {renderChannels(audioChannels)}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    audioChannels: state.audioChannels,
  };
};

export default connect(mapStateToProps, { updateRoom, addChannel })(
  AudioSettings
);
