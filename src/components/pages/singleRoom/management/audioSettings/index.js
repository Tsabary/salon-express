import "./styles.scss";
import React, { useState, useContext, useEffect } from "react";
import { connect } from "react-redux";

import { ReactSVG } from "react-svg";
import ReactTooltip from "react-tooltip";
import { isMobile } from "react-device-detect";

import { RoomContext } from "../../../../../providers/Room";

import {
  updateRoom,
  addChannel,
  setActiveChannel,
  addChannelListener,
  detachChannelListener,
} from "../../../../../actions/rooms";
import {
  addChannelFloorRoom,
  setActiveChannelFloorRoom,
} from "../../../../../actions/floors";
import { extractUrlId } from "../../../../../utils/externalContent";

import SingleChannel from "./singleChannel";
import InputField from "../../../../formComponents/inputField";
import User from "../../../../otherComponents/user/search";
import UserSearch from "../../../../otherComponents/userSearch";

const AudioSettings = ({
  entityID,
  roomIndex,
  floor,
  audioChannels,
  addChannel,
  addChannelFloorRoom,
  setActiveChannel,
  setActiveChannelFloorRoom,
  addChannelListener,
  detachChannelListener,
}) => {
  const {
    globalCurrentAudioChannel,
    setGlobalCurrentAudioChannel,
  } = useContext(RoomContext);

  const [newChannel, setNewChannel] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isPlayHovered, setIsPlayHovered] = useState(false);
  const [isRemoveHovered, setIsRemoveHovered] = useState(false);

  const renderChannels = (channels) => {
    return channels.map((channel) => {
      return (
        <SingleChannel
          channel={channel}
          entityID={entityID}
          roomIndex={roomIndex}
          floor={floor}
          currentAudioChannel={globalCurrentAudioChannel}
          key={channel.id}
        />
      );
    });
  };

  const trimYoutubeLink = (string) => {
    switch (true) {
      case string.includes("youtube.com/watch?v="):
        const splt1 = string.split("watch?v=");
        if (splt1.length > 1) {
          setFormError(null);
          return { valid: true, id: splt1[1].split("?")[0] };
        } else {
          return { valid: false };
        }

      case string.includes("youtu.be"):
        const spltArr = string.split("/");
        const splt2 = spltArr[spltArr.length - 1];

        setFormError(null);
        return { valid: true, id: splt2.split("?")[0] };

      default:
        setFormError(
          "Something isn't right with this data, pleace copy it and try again"
        );
        return { valid: false };
    }
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
            placeHolder="Youtube video URL"
            value={newChannel && newChannel.link}
            onChange={(link) => {
              if (!link) {
                setNewChannel({
                  ...newChannel,
                  link: "",
                });
              } else {
                if (trimYoutubeLink(link).valid)
                  setNewChannel({
                    ...newChannel,
                    link: trimYoutubeLink(link).id,
                  });
              }
            }}
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
            // numbersAndLetters
          />
        );

      case "Website":
        return (
          <InputField
            type="text"
            placeHolder="Website URL"
            value={newChannel && newChannel.link}
            onChange={(link) => {
              setNewChannel({ ...newChannel, link });
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="management__audio-settings section__container">
      <div className="max-fr-max">
        <div className="section__title">External Content</div>

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
                  "Paste here links to any website that you'd like to show the other guests in the Room",
              }}
            />
          </ReactTooltip>
        </>

        {!isMobile ? (
          <div
            onClick={() => (window.location.hash = "audio-channels")}
            className="extra-tiny-margin-bottom"
          >
            <ReactSVG
              src="../svgs/expand.svg"
              wrapper="div"
              data-tip={`expandAudioSettings${entityID}`}
              data-for={`expandAudioSettings${entityID}`}
              beforeInjection={(svg) => {
                svg.classList.add("svg-icon--small");
              }}
            />
            <ReactTooltip id={`expandAudioSettings${entityID}`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: "Expand external content channels.",
                }}
              />
            </ReactTooltip>
          </div>
        ) : (
          <div />
        )}
      </div>

      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          if (
            newChannel &&
            newChannel.title &&
            // newChannel.source &&
            newChannel.link
          ) {
            const sourceObj = extractUrlId(newChannel.link);
            const channelObj = {
              ...newChannel,
              link: sourceObj.link,
              source: sourceObj.source,
            };

            !floor
              ? addChannel(channelObj, entityID, () => setNewChannel(null))
              : addChannelFloorRoom(channelObj, roomIndex, floor, () =>
                  setNewChannel(null)
                );
          }
        }}
      >
        <div className="tile-form">
          <div>
            <InputField
              type="text"
              placeHolder="URL"
              value={newChannel && newChannel.link}
              onChange={(link) => {
                setNewChannel({ ...newChannel, link });
              }}
            />

            <InputField
              type="text"
              placeHolder="Title"
              value={newChannel && newChannel.title}
              onChange={(title) => {
                setNewChannel({
                  ...newChannel,
                  title: title
                    .replace(/^([^-]*-)|-/g, "$1")
                    .replace(/[^\p{L}\s\d-]+/gu, ""),
                });
              }}
              className="extra-tiny-margin-top"
            />

            {newChannel && newChannel.user ? (
              <div className="fr-max">
                <User
                  className="extra-tiny-margin-top"
                  user={newChannel.user}
                />

                <div
                  className="clickable"
                  onClick={() => {
                    const UpNeCh = { ...newChannel };
                    delete UpNeCh.user;
                    setNewChannel(UpNeCh);
                  }}
                >
                  <ReactSVG
                    src="../svgs/trash.svg"
                    wrapper="div"
                    data-tip={`deleteUserAudioSettings${newChannel.user.uid}`}
                    data-for={`deleteUserAudioSettings${newChannel.user.uid}`}
                    beforeInjection={(svg) => {
                      svg.classList.add("svg-icon--normal");
                    }}
                  />
                  <ReactTooltip
                    id={`deleteUserAudioSettings${newChannel.user.uid}`}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: "Clicking would remove this event immediately.",
                      }}
                    />
                  </ReactTooltip>
                </div>
              </div>
            ) : (
              <UserSearch
                className="extra-tiny-margin-top"
                placeholder="User (if any)"
                existingUsers={[]}
                handleChoose={(user) => {
                  setNewChannel({
                    ...newChannel,
                    user,
                  });
                }}
              />
            )}
          </div>
          <div className="audio-settings__buttons">
            {/* Pause button for current */}
            {globalCurrentAudioChannel && globalCurrentAudioChannel.source ? (
              <div
                className="audio-settings__button"
                data-tip={`externalContentRemove${entityID}`}
                data-for={`externalContentRemovey${entityID}`}
                onMouseEnter={() => setIsRemoveHovered(true)}
                onMouseLeave={() => setIsRemoveHovered(false)}
                onClick={() => {
                  !floor
                    ? setActiveChannel(
                        { source: "", link: "" },
                        entityID,
                        () => {
                          setGlobalCurrentAudioChannel({
                            source: "",
                            link: "",
                          });
                        }
                      )
                    : setActiveChannelFloorRoom(
                        { source: "", link: "" },
                        roomIndex,
                        floor,
                        () => {
                          setGlobalCurrentAudioChannel({
                            source: "",
                            link: "",
                          });
                        }
                      );
                }}
              >
                <ReactSVG
                  src={
                    isPlayHovered ? "../svgs/pause.svg" : "../svgs/pause.svg"
                  }
                  wrapper="div"
                  beforeInjection={(svg) => {
                    svg.classList.add("svg-icon--small");
                  }}
                />
                <ReactTooltip id={`externalContentRemove${entityID}`}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: "Remove current content",
                    }}
                  />
                </ReactTooltip>
              </div>
            ) : null}

            <div
              className="audio-settings__button"
              data-tip={`externalContentPlay${entityID}`}
              data-for={`externalContentPlay${entityID}`}
              onMouseEnter={() => setIsPlayHovered(true)}
              onMouseLeave={() => setIsPlayHovered(false)}
              onClick={() => {
                if (newChannel && newChannel.link) {
                  const sourceObj = extractUrlId(newChannel.link);

                  !floor
                    ? setActiveChannel(sourceObj, entityID, () => {
                        setGlobalCurrentAudioChannel(sourceObj);
                        setNewChannel(null);
                      })
                    : setActiveChannelFloorRoom(
                        sourceObj,
                        roomIndex,
                        floor,
                        () => {
                          setGlobalCurrentAudioChannel(sourceObj);
                          setNewChannel(null);
                        }
                      );
                }
              }}
            >
              {/* Play button without saving */}
              <ReactSVG
                src={
                  isPlayHovered ? "../svgs/play-white.svg" : "../svgs/play.svg"
                }
                wrapper="div"
                beforeInjection={(svg) => {
                  svg.classList.add("svg-icon--small");
                }}
              />
              <ReactTooltip id={`externalContentPlay${entityID}`}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: "Play without saving",
                  }}
                />
              </ReactTooltip>
            </div>

            {/* Save button */}
            <button
              type="submit"
              className="audio-settings__button"
              data-tip={`externalContentSave${entityID}`}
              data-for={`externalContentSave${entityID}`}
            >
              +
            </button>
            <ReactTooltip id={`externalContentSave${entityID}`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: "Save channel",
                }}
              />
            </ReactTooltip>
          </div>
        </div>
        {formError ? (
          <div className="form-error tiny-margin-top">{formError}</div>
        ) : null}
      </form>

      <div
        className="small-button tiny-margin-top"
        onClick={() => (window.location.hash = "content-suggestions")}
      >
        Explore Suggestions
      </div>

      {audioChannels.length ||
      (floor && floor.rooms[roomIndex] && floor.rooms[roomIndex].audio_channels)
        ? renderChannels(
            floor ? floor.rooms[roomIndex].audio_channels : audioChannels
          )
        : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    audioChannels: state.audioChannels,
  };
};

export default connect(mapStateToProps, {
  updateRoom,
  addChannel,
  addChannelFloorRoom,
  setActiveChannel,
  setActiveChannelFloorRoom,
  addChannelListener,
  detachChannelListener,
})(AudioSettings);
