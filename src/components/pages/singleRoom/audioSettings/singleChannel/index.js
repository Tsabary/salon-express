import "./styles.scss";
import React, { useContext } from "react";
import { connect } from "react-redux";

import { ReactSVG } from "react-svg";
import ReactTooltip from "react-tooltip";

import { setActiveChannel, deleteChannel } from "../../../../../actions";
import { RoomContext } from "../../../../../providers/Room";

const SingleChannel = ({
  channel,
  room,
  index,
  currentAudioChannel,
  setActiveChannel,
  deleteChannel,
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
              deleteChannel(channel, room, () => {
                if (
                  currentAudioChannel &&
                  currentAudioChannel.link === channel.link
                )
                  setActiveChannel(room.id, null, () =>
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
                setActiveChannel(room.id, null, () =>
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
                setActiveChannel(room.id, channel, () =>
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

export default connect(null, { setActiveChannel, deleteChannel })(
  SingleChannel
);
