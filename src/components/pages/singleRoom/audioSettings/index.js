import "./styles.scss";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../../../providers/Auth";
import validator from "validator";
import ReactTooltip from "react-tooltip";

import { updateRoom, addChannel } from "../../../../actions";
import { connect } from "react-redux";

import ToggleField from "../../../formComponents/toggleField";
import InputField from "../../../formComponents/inputField";
import SingleChannel from "./singleChannel";

const AudioSettings = ({
  audioChannels,
  values,
  setValues,
  updateRoom,
  addChannel,
  room,
  currentAudioChannel,
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const [newChannel, setNewChannel] = useState(null);

  const renderChannels = (channels) => {
    return channels.map((channel) => {
      return (
        <SingleChannel channel={channel} room={room} currentAudioChannel={currentAudioChannel} key={channel.id} />
      );
    });
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

      <form
        className="fr-fr-max"
        autoComplete="off"
        onSubmit={() => addChannel(newChannel, room)}
      >
        <InputField
          type="text"
          placeHolder="Name"
          value={newChannel && newChannel.title}
          onChange={(title) => {
            setNewChannel({ ...newChannel, title });
          }}
        />
        <InputField
          type="text"
          placeHolder="Mixlr ID"
          value={newChannel && newChannel.link}
          onChange={(link) => {
            setNewChannel({ ...newChannel, link });
          }}
        />
        <button type="submit" className="audio-settings__add">
          +
        </button>
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
