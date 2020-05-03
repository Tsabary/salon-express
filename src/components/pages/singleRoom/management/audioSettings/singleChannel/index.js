import "./styles.scss";
import React, { useContext } from "react";
import { connect } from "react-redux";

import { ReactSVG } from "react-svg";
import ReactTooltip from "react-tooltip";

import { RoomContext } from "../../../../../../providers/Room";

import {
  setActiveChannel,
  deleteChannel,
  deleteChannelFloorRoom,
  setActiveChannelFloorRoom,
} from "../../../../../../actions";

const SingleChannel = ({
  channel,
  room,
  roomIndex,
  floor,
  currentAudioChannel,
  setActiveChannel,
  setActiveChannelFloorRoom,
  deleteChannel,
  deleteChannelFloorRoom,
}) => {
  const { setGlobalCurrentAudioChannel } = useContext(RoomContext);

  return (
    <div
      className={
        currentAudioChannel && currentAudioChannel.link === channel.link
          ? "single-channel single-channel--active"
          : "single-channel single-channel"
      }
    >
      <div className="fr-max">
        <div>
          <div
            className={
              currentAudioChannel && currentAudioChannel.link === channel.link
                ? "single-channel__title--active"
                : "single-channel__title"
            }
          >
            {channel.title}
          </div>
          <div
            className={
              currentAudioChannel && currentAudioChannel.link === channel.link
                ? "single-channel__link--active"
                : "single-channel__link"
            }
          >
            {channel.link}
          </div>
        </div>
        <div className="max-max">
          <div
            className="clickable"
            onClick={() =>
              !floor
                ? deleteChannel(channel, room, () => {
                    if (
                      currentAudioChannel &&
                      currentAudioChannel.link === channel.link
                    )
                      setActiveChannel(null, room.id, () =>
                        setGlobalCurrentAudioChannel(null)
                      );
                  })
                : deleteChannelFloorRoom(channel, roomIndex, floor, () => {
                    if (
                      currentAudioChannel &&
                      currentAudioChannel.link === channel.link
                    )
                      setActiveChannelFloorRoom(null, roomIndex, floor, () =>
                        setGlobalCurrentAudioChannel(null)
                      );
                  })
            }
          >
            <ReactSVG
              src="../svgs/trash.svg"
              wrapper="div"
              data-tip={`deleteChannel${channel.id}`}
              data-for={`deleteChannel${channel.id}`}
              beforeInjection={(svg) => {
                svg.classList.add("svg-icon--normal");
              }}
            />
            <ReactTooltip id={`deleteChannel${channel.id}`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: "Clicking would remove this channel immediately.",
                }}
              />
            </ReactTooltip>
          </div>

          {currentAudioChannel && currentAudioChannel.link === channel.link ? (
            <div
              className="clickable"
              onClick={() => {
                !floor
                  ? setActiveChannel(null, room.id, () =>
                      setGlobalCurrentAudioChannel(null)
                    )
                  : setActiveChannelFloorRoom(null, roomIndex, floor, () =>
                      setGlobalCurrentAudioChannel(null)
                    );
              }}
            >
              <ReactSVG
                src="../svgs/pause.svg"
                wrapper="div"
                beforeInjection={(svg) => {
                  svg.classList.add("svg-icon--normal");
                }}
              />
            </div>
          ) : (
            <div
              className="clickable"
              onClick={() => {
                !floor
                  ? setActiveChannel(channel, room.id, () =>
                      setGlobalCurrentAudioChannel(channel)
                    )
                  : setActiveChannelFloorRoom(channel, roomIndex, floor, () =>
                      setGlobalCurrentAudioChannel(channel)
                    );
              }}
            >
              <ReactSVG
                src="../svgs/play.svg"
                wrapper="div"
                beforeInjection={(svg) => {
                  svg.classList.add("svg-icon--normal");
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default connect(null, {
  setActiveChannel,
  setActiveChannelFloorRoom,
  deleteChannel,
  deleteChannelFloorRoom,
})(SingleChannel);
