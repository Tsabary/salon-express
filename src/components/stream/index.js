import "./styles.scss";
import React, { useContext, useState } from "react";
import { connect } from "react-redux";

import Moment from "react-moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Helmet } from "react-helmet";
import ReactTooltip from "react-tooltip";
import AddToCalendar from "react-add-to-calendar";
import Loader from "react-loader-spinner";

import { AuthContext } from "../../providers/Auth";
import { SearchContext } from "../../providers/Search";
import { PageContext } from "../../providers/Page";

import {
  removeStream,
  attand,
  unattand,
  setEditedStream,
  follow,
  unfollow,
  togglePopup,
} from "../../actions";

const Stream = ({
  stream,
  user,
  removeStream,
  attand,
  unattand,
  setEditedStream,
  follow,
  unfollow,
  togglePopup,
}) => {
  const { setCurrentUserProfile } = useContext(AuthContext);
  const { setSearchTerm } = useContext(SearchContext);
  const { setPage } = useContext(PageContext);

  const [shareButton, setShareButton] = useState("Share");
  const [handlingFollow, setHandlingFollow] = useState(false);

  const startDate =
    Object.prototype.toString.call(stream.start) === "[object Date]"
      ? stream.start
      : stream.start.toDate();

  const endDate =
    Object.prototype.toString.call(stream.end) === "[object Date]"
      ? stream.end
      : stream.end.toDate();

  const event = {
    title: stream.title,
    description: `${stream.body} \r Stream URL: ${stream.url}`,
    startTime: startDate,
    endTime: endDate,
  };

  const renderTags = () => {
    return stream.tags.map((el) => {
      return (
        <div
          className="stream__tag"
          key={el}
          onClick={() => {
            setPage(5);
            setSearchTerm(el);
          }}
        >
          {el}
        </div>
      );
    });
  };

  const shareButtonTimer = () => {
    setTimeout(() => {
      setShareButton("Share");
    }, 3000);
  };

  return (
    <div
      className={
        startDate.getTime() < Date.now() && endDate > Date.now()
          ? "stream live"
          : "stream"
      }
    >
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
              {stream.attendants.includes(user.uid) ? (
                <div className="social__icon--stream">
                  <a href={"https://" + stream.url} target="_blank">
                    <svg className="social__icon social__icon--stream-icon">
                      <use xlinkHref="../sprite.svg#stream"></use>
                    </svg>
                  </a>
                </div>
              ) : (
                <>
                  <svg
                    className="social__icon-disabled"
                    data-tip
                    data-for={"disabled" + stream.id}
                  >
                    <use xlinkHref="../sprite.svg#stream"></use>
                  </svg>

                  <ReactTooltip
                    id={"disabled" + stream.id}
                    type="dark"
                    effect="solid"
                    place="right"
                  >
                    RSVP to receive link
                  </ReactTooltip>
                </>
              )}

              {stream.host_ig ? (
                <div className="social__icon--instagram">
                  <a href={"https://" + stream.host_ig} target="_blank">
                    <svg className="social__icon social__icon--instagram-icon">
                      <use xlinkHref="../sprite.svg#instagram"></use>
                    </svg>
                  </a>
                </div>
              ) : null}

              {stream.host_twitter ? (
                <div className="social__icon--twitter">
                  <a href={"https://" + stream.host_twitter} target="_blank">
                    <svg className="social__icon social__icon--twitter-icon">
                      <use xlinkHref="../sprite.svg#twitter"></use>
                    </svg>
                  </a>
                </div>
              ) : null}

              {stream.host_fb ? (
                <div className="social__icon--facebook">
                  <a href={"https://" + stream.host_fb} target="_blank">
                    <svg className="social__icon social__icon--facebook-icon">
                      <use xlinkHref="../sprite.svg#facebook"></use>
                    </svg>
                  </a>
                </div>
              ) : null}

              {stream.host_web ? (
                <div className="social__icon--web">
                  <a href={"https://" + stream.host_web} target="_blank">
                    <svg className="social__icon social__icon--web-icon">
                      <use xlinkHref="../sprite.svg#web"></use>
                    </svg>
                  </a>
                </div>
              ) : null}
            </div>

            <div className="stream__content">
              <div className="stream__title">{stream.title}</div>
              <div className="stream__host">
                Host:{" "}
                <span className="stream__host-name">{stream.host_name}</span>{" "}
              </div>

              {stream.price ? (
                <div className="stream__host">Price: {stream.price} USD</div>
              ) : (
                <div className="stream__live">FREE</div>
              )}

              {Date.now() < startDate.getTime() ? (
                <div className="stream__timestamp">
                  Starts <Moment fromNow>{startDate}</Moment>
                </div>
              ) : Date.now() < endDate.getTime() ? (
                <div className="stream__live">Stream is live</div>
              ) : (
                <div className="stream__timestamp">
                  Ended{" "}
                  <Moment fromNow>
                    {startDate.getTime() + stream.duration}
                  </Moment>
                </div>
              )}

              {stream.attendants.length > 5 || stream.user_ID === user.uid ? (
                <div className="stream__attendants">
                  {stream.attendants.length} attending
                </div>
              ) : null}
              <div className="stream__body">{stream.body}</div>

              {renderTags()}
            </div>
          </div>
        </div>
        {user.uid &&
        stream.attendants.includes(user.uid) &&
        user.uid &&
        user.uid !== stream.user_ID ? (
          <div
            className="stream__attending clickable"
            onClick={() => unattand(stream, user.uid)}
          >
            Attending
          </div>
        ) : user.uid && user.uid !== stream.user_ID ? (
          <div
            className="stream__button stream__button-full clickable"
            onClick={() => attand(stream, user.uid)}
          >
            Attend
          </div>
        ) : null}

        {!user.uid ||
        user.uid === stream.user_ID ? null : !user.following.includes(
            stream.user_ID
          ) ? (
          <div
            className="stream__button stream__button-full clickable"
            onClick={() => {
              follow(user, stream.user_ID, setCurrentUserProfile, () =>
                setHandlingFollow(false)
              );
              setHandlingFollow(true);
            }}
          >
            {handlingFollow ? (
              <div className="centered">
                <Loader
                  type="ThreeDots"
                  color="#ffffff"
                  height={20}
                  width={20}
                />
              </div>
            ) : (
              "Follow Host"
            )}
          </div>
        ) : (
          <div
            className="stream__button stream__button-line clickable"
            onClick={() => {
              {
                unfollow(user, stream.user_ID, setCurrentUserProfile, () =>
                  setHandlingFollow(false)
                );
                setHandlingFollow(true);
              }
            }}
          >
            {handlingFollow ? (
              <div className="centered">
                <Loader
                  type="ThreeDots"
                  color="#6f00ff"
                  height={20}
                  width={20}
                />
              </div>
            ) : (
              "Unfollow Host"
            )}
          </div>
        )}

        <CopyToClipboard
          text={`https://salon.express/stream/${stream.id}`}
          data-tip
          data-for={`share${stream.id}`}
          onCopy={() => {
            shareButtonTimer();
            setShareButton("Share URL copied!");
          }}
        >
          <div className="stream__button stream__button-line clickable">
            {shareButton}
          </div>
        </CopyToClipboard>

        <AddToCalendar
          event={event}
          buttonWrapperClass="stream__button stream__button-line clickable"
          dropdownClass="stream__button stream__button-line clickable"
        />

        {user.uid === stream.user_ID ? (
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
              onClick={() => {
                setEditedStream(stream);
                togglePopup();
              }}
            >
              Edit
            </a>
          </div>
        ) : null}

        {/* <div className="stream__follow clickable">Follow Host</div> */}
      </span>
      <span className="stream__hidden">
        <div>Are you sure you want to delete this event?</div>
        <div className="stream__actions small-margin-top">
          <label
            className="stream-button stream-button__normal"
            htmlFor={`stream-delete-checkbox` + stream.id}
          >
            Cancel
          </label>

          <label
            className="stream-button stream-button__delete"
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
  setEditedStream,
  follow,
  unfollow,
  togglePopup,
})(Stream);
