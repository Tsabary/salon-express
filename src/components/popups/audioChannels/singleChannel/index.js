import "./styles.scss";
import React, { useContext } from "react";
import { connect } from "react-redux";

import { Draggable } from "react-beautiful-dnd";
import { ReactSVG } from "react-svg";
import ReactTooltip from "react-tooltip";

import { setActiveChannel, deleteChannel } from "../../../../actions/rooms";
import { RoomContext } from "../../../../providers/Room";

const SingleChannel = ({
  channel,
  room,
  index,
  currentAudioChannel,
  setActiveChannel,
  deleteChannel,
}) => {
  const {
    globalCurrentAudioChannel,
    setGlobalCurrentAudioChannel,
  } = useContext(RoomContext);

  return (
    <Draggable draggableId={channel.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={
            globalCurrentAudioChannel &&
            globalCurrentAudioChannel.link === channel.link
              ? "single-channel single-channel--active clickable"
              : "single-channel single-channel clickable"
          }
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          <div className="fr-max">
            <div>
              <div
                className={
                  globalCurrentAudioChannel &&
                  globalCurrentAudioChannel.link === channel.link
                    ? "single-channel__title--active"
                    : "single-channel__title"
                }
              >
                {channel.title}
              </div>
              <div
                className={
                  globalCurrentAudioChannel &&
                  globalCurrentAudioChannel.link === channel.link
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
                      globalCurrentAudioChannel &&
                      globalCurrentAudioChannel.link === channel.link
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

              {globalCurrentAudioChannel &&
              globalCurrentAudioChannel.link === channel.link ? (
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
      )}
    </Draggable>
  );
};

export default connect(null, { setActiveChannel, deleteChannel })(
  SingleChannel
);
