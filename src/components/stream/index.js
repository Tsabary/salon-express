import "./styles.scss";
import React, { useContext, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Moment from "react-moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactTooltip from "react-tooltip";
import AddToCalendar from "react-add-to-calendar";
import { ReactSVG } from "react-svg";
import ShowMoreText from "react-show-more-text";

import history from "../../history";

import { AuthContext } from "../../providers/Auth";
import { SearchContext } from "../../providers/Search";
import { PageContext } from "../../providers/Page";

import {
  removeStream,
  attand,
  unattand,
  setEditedStream,
  togglePopup,
} from "../../actions";

import FollowBtn from "../followBtn";

const Stream = ({
  stream,
  currentUserProfile,
  removeStream,
  attand,
  unattand,
  setEditedStream,

  togglePopup,
}) => {
  const myHistory = useHistory(history);

  // const { currentUserProfile } = useContext(AuthContext);
  const { setSearchTerm } = useContext(SearchContext);
  const { setPage } = useContext(PageContext);

  const [shareButton, setShareButton] = useState("Share");

  const dateNow = new Date();

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

  const handleChange = (path) => {
    setSearchTerm(null);
    setPage(6);
    myHistory.push(path);
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
            <img
              className="cover-image__preview"
              src={"https://" + stream.image}
            />
          </div>

          <div className="stream__center">
            <div className="social">
              {stream.attendants.includes(currentUserProfile.uid) ? (
                <div className="social__icon--stream">
                  <a href={"https://" + stream.url} target="_blank">
                    <svg className="social__icon social__icon--stream-icon">
                      <use xlinkHref="../sprite.svg#stream"></use>
                    </svg>
                  </a>
                </div>
              ) : (
                <>
                  <div data-tip data-for={"disabled" + stream.id}>
                    <svg className="social__icon-disabled">
                      <use xlinkHref="../sprite.svg#stream"></use>
                    </svg>
                  </div>

                  <ReactTooltip
                    id={"disabled" + stream.id}
                    type="dark"
                    effect="solid"
                    place="right"
                  >
                    Attend to get access
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

              {stream.host_soundcloud ? (
                <div className="social__icon--soundcloud">
                  <a href={"https://" + stream.host_soundcloud} target="_blank">
                    <svg className="social__icon social__icon--soundcloud-icon">
                      <use xlinkHref="../sprite.svg#soundcloud"></use>
                    </svg>
                  </a>
                </div>
              ) : null}

              {stream.host_spotify ? (
                <div className="social__icon--spotify">
                  <a href={"https://" + stream.host_spotify} target="_blank">
                    <svg className="social__icon social__icon--spotify-icon">
                      <use xlinkHref="../sprite.svg#spotify"></use>
                    </svg>
                  </a>
                </div>
              ) : null}

              {stream.host_youtube ? (
                <div className="social__icon--youtube">
                  <a href={"https://" + stream.host_youtube} target="_blank">
                    <svg className="social__icon social__icon--youtube-icon">
                      <use xlinkHref="../sprite.svg#youtube"></use>
                    </svg>
                  </a>
                </div>
              ) : null}

              {stream.host_linkedin ? (
                <div className="social__icon--twitter">
                  <a href={"https://" + stream.host_linkedin} target="_blank">
                    <svg className="social__icon social__icon--linkedin-icon">
                      <use xlinkHref="../sprite.svg#linkedin"></use>
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
                Posted by:{" "}
                <span
                  className="stream__host-name"
                  onClick={() => handleChange(`/${stream.user_username}`)}
                >
                  {stream.user_username}
                </span>
              </div>

              <div className="stream__live">
                {stream.tips_link ? "TIPS WELCOME" : "FREE"}
              </div>

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

              {stream.attendants.length > 5 ||
              stream.user_ID === currentUserProfile.uid ? (
                <div className="stream__attendants">
                  {stream.attendants.length} attending
                </div>
              ) : null}

              <ShowMoreText
                /* Default options */
                lines={5}
                more="Show more"
                less="Show less"
                anchorClass="stream__read-more"
                // onClick={executeOnClick}
                // expanded={false}
                // width={}
              >
                {stream.body}
              </ShowMoreText>

              {/* <div className="stream__body">{stream.body}</div> */}

              {renderTags()}
            </div>
          </div>
        </div>

        {endDate > dateNow &&
        currentUserProfile.uid &&
        stream.attendants.includes(currentUserProfile.uid) &&
        currentUserProfile.uid !== stream.user_ID ? (
          <div
            className="stream__attending clickable"
            onClick={() => unattand(stream, currentUserProfile.uid)}
          >
            Attending
          </div>
        ) : endDate > dateNow &&
          currentUserProfile.uid &&
          currentUserProfile.uid !== stream.user_ID ? (
          <div
            className="stream__button stream__button-full clickable"
            onClick={() => attand(stream, currentUserProfile.uid)}
          >
            Attend
          </div>
        ) : endDate > dateNow ? (
          <a href="#sign-up">
            <div className="stream__button stream__button-full clickable">
              Attend
            </div>
          </a>
        ) : null}

        <FollowBtn
          currentUserProfile={currentUserProfile}
          strangerID={stream.user_ID}
          textFollow="Follow Host"
          textUnfollow="Unfollow Host"
        />

        {endDate > dateNow ? (
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
        ) : null}

        {stream.tips_link ? (
          <div className="stream__button stream__button-line clickable">
            <div className="stream__paypal">
              <div className="stream__paypal-svg">
                <svg className="stream__donate-icon">
                  <use xlinkHref="../sprite.svg#donate"></use>
                </svg>

                {/* <ReactSVG src="../../../svgs/paypal.svg" /> */}
              </div>
              <div className="stream__paypal-text">Leave a Tip</div>
              <div />
            </div>
          </div>
        ) : null}

        {endDate > dateNow ? (
          <AddToCalendar
            event={event}
            buttonWrapperClass="stream__button stream__button-line clickable"
            dropdownClass="stream__button stream__button-line clickable"
          />
        ) : null}

        {currentUserProfile.uid === stream.user_ID ? (
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
  togglePopup,
})(Stream);
