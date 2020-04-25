import "./styles.scss";
import React from "react";
import { ReactSVG } from "react-svg";

import { setActiveChannel, deleteChannel } from "../../../../../actions";
import { connect } from "react-redux";

const SingleChannel = ({
  channel,
  room,
  currentAudioChannel,
  setActiveChannel,
  deleteChannel,
}) => {
  console.log("minecurrentAudioChannel", currentAudioChannel);
  console.log("channel.link", channel.link);
  return (
    <div
      className={
        currentAudioChannel === channel.link
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
              currentAudioChannel &&  currentAudioChannel.link === channel.link
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
                if ( currentAudioChannel && currentAudioChannel.link === channel.link)
                  setActiveChannel(room.id, null);
              })
            }
          >
            <ReactSVG
              src="../svgs/trash.svg"
              wrapper="div"
              beforeInjection={(svg) => {
                svg.classList.add("room__icon");
              }}
            />
          </div>

          { currentAudioChannel && currentAudioChannel.link === channel.link ? (
            <div
              className="clickable"
              onClick={() => setActiveChannel(room.id, null)}
            >
              <ReactSVG
                src="../svgs/pause.svg"
                wrapper="div"
                beforeInjection={(svg) => {
                  svg.classList.add("room__icon");
                }}
              />
            </div>
          ) : (
            <div
              className="clickable"
              onClick={() => setActiveChannel(room.id, channel)}
            >
              <ReactSVG
                src="../svgs/play.svg"
                wrapper="div"
                beforeInjection={(svg) => {
                  svg.classList.add("room__icon");
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
