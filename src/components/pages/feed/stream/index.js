import "./styles.scss";
import React, { useContext, useState } from "react";
import Moment from "react-moment";

import { connect } from "react-redux";

import { AuthContext } from "../../../../providers/Auth";

import {
  removeStream,
  attand,
  unattand,
  setEditedStream
} from "../../../../actions";

const Stream = ({
  stream,
  userUID,
  removeStream,
  attand,
  unattand,
  setEditedStream
}) => {
  const renderTags = () => {
    return stream.tags.map(el => {
      return (
        <div
          className="stream__tag"
          key={el}
        >
          {el}
        </div>
      );
    });
  };

  return (
    <div className="stream">
      <input
        className="stream-delete-checkbox"
        type="checkbox"
        id={`stream-delete-checkbox` + stream.id}
      />
      <span className="stream__visible">
        <div className="stream__top">
          <div className="cover-image__container">
            <img className="cover-image__preview" src={stream.image} />
          </div>

          <div className="stream__center">
            <div className="social">
              {stream.url ? (
                <div className="social__icon--stream">
                  <a href={stream.url} target="_blank">
                    <svg className="social__icon social__icon--stream-icon">
                      <use xlinkHref="./sprite.svg#stream"></use>
                    </svg>
                  </a>
                </div>
              ) : null}

              {stream.host_ig ? (
                <div className="social__icon--instagram">
                  <a href={stream.host_ig} target="_blank">
                    <svg className="social__icon social__icon--instagram-icon">
                      <use xlinkHref="./sprite.svg#instagram"></use>
                    </svg>
                  </a>
                </div>
              ) : null}

              {stream.host_twitter ? (
                <div className="social__icon--twitter">
                  <a href={stream.host_twitter} target="_blank">
                    <svg className="social__icon social__icon--twitter-icon">
                      <use xlinkHref="./sprite.svg#twitter"></use>
                    </svg>
                  </a>
                </div>
              ) : null}

              {stream.host_fb ? (
                <div className="social__icon--facebook">
                  <a href={stream.host_fb} target="_blank">
                    <svg className="social__icon social__icon--facebook-icon">
                      <use xlinkHref="./sprite.svg#facebook"></use>
                    </svg>
                  </a>
                </div>
              ) : null}

              {stream.host_web ? (
                <div className="social__icon--web">
                  <a href={stream.host_web} target="_blank">
                    <svg className="social__icon social__icon--web-icon">
                      <use xlinkHref="./sprite.svg#web"></use>
                    </svg>
                  </a>
                </div>
              ) : null}
            </div>

            <div className="stream__content">
              <div className="stream__title">{stream.title}</div>
              <div className="stream__host">Hosted by {stream.host_name}</div>

              {Date.now() < stream.start_timestamp ? (
                <div className="stream__timestamp">
                  Starts <Moment fromNow>{stream.start_timestamp}</Moment>
                </div>
              ) : Date.now() > stream.ends_timestamp ? (
                <div className="stream__timestamp">
                  Ends <Moment fromNow>{stream.ends_timestamp}</Moment>
                </div>
              ) : (
                <div className="stream__timestamp">
                  Ended <Moment fromNow>{stream.ends_timestamp}</Moment>
                </div>
              )}

              {stream.attendants.length > 5 ? (
                <div className="stream__attendants">
                  {" "}
                  {stream.attendants.length} attending
                </div>
              ) : null}
              <div className="stream__body">{stream.body}</div>

              {renderTags()}
            </div>
          </div>
        </div>
        {userUID && stream.attendants.includes(userUID) ? (
          <div
            className="stream__attending clickable"
            onClick={() => unattand(stream, userUID)}
          >
            Attending
          </div>
        ) : (
          <div
            className="stream__attend clickable"
            onClick={() => attand(stream, userUID)}
          >
            Attend
          </div>
        )}

        {userUID === stream.user_ID ? (
          <div className="stream__actions">
            <label
              className="stream-button stream-button__delete"
              htmlFor={`stream-delete-checkbox` + stream.id}
            >
              Delete
            </label>

            <a
              className="stream-button stream-button__normal"
              href="#edited-stream"
              onClick={() => setEditedStream(stream)}
            >
              Edit
            </a>
          </div>
        ) : null}
        {/* <div className="stream__follow clickable">Follow Host</div> */}
      </span>
      <span className="stream__hidden">
        <div>Are you sure you want to delete this event?</div>
        <div className="max-max small-margin-top">
          <label
            className="text-button-normal"
            htmlFor={`stream-delete-checkbox` + stream.id}
          >
            Cancel
          </label>

          <label
            className="text-button-delete"
            htmlFor={`stream-delete-checkbox` + stream.id}
            onClick={() => removeStream(stream)}
          >
            Delete
          </label>
        </div>
      </span>
    </div>
  );
};

export default connect(null, {
  removeStream,
  attand,
  unattand,
  setEditedStream
})(Stream);
