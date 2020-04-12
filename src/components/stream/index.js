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
import { getLanguageName } from "../../utils/languages";

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
    description: `${stream.body} \r Stream URL: ${
      "https://meet.jit.si/ClassExpress-" + stream.id
    }`,
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

          <div className="stream__content">
            {startDate.getTime() > Date.now() ? (
              <div className="stream__timestamp">
                {startDate.getDay() !== new Date().getDay() ? (
                  <span>
                    <Moment format="DD/MM/YYYY HH:mm">{startDate}</Moment>
                  </span>
                ) : (
                  <span>
                    Starts <Moment fromNow>{startDate}</Moment>
                  </span>
                )}
              </div>
            ) : Date.now() < endDate.getTime() ? (
              <div className="stream__live">Practice is live</div>
            ) : (
              <div className="stream__timestamp">
                Ended{" "}
                <Moment fromNow>{startDate.getTime() + stream.duration}</Moment>
              </div>
            )}

            <div className="stream__title">{stream.title}</div>
            <div className="stream__host">
              Hosted by:{" "}
              <span
                className="stream__host-name"
                onClick={() => handleChange(`/${stream.user_username}`)}
              >
                {stream.user_username}
              </span>
            </div>

            <div className="stream__languages">
              <div className="max-max">
                <div className="stream__languages--practice">
                  Practicing {getLanguageName(stream.practice_language)} (
                  {stream.level === 1
                    ? "Beginner"
                    : stream.level === 3
                    ? "Mid-Level"
                    : "Advanced"}
                  )
                </div>
                <div className="info" data-tip data-for={"info" + stream.id} />
                <ReactTooltip
                  id={"info" + stream.id}
                  type="dark"
                  effect="solid"
                  place="top"
                >
                  You can always join and just listen
                </ReactTooltip>
              </div>

              <div className="stream__languages--base">
                Need to know {getLanguageName(stream.base_language)}
              </div>
            </div>

            {stream.attendants.length > 2 ||
            (currentUserProfile &&
              stream.user_ID === currentUserProfile.uid) ? (
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

            <div className="tiny-margin-top"> {renderTags()}</div>
          </div>
        </div>

        {currentUserProfile &&
        stream.attendants.includes(currentUserProfile.uid) ? (
          <a
            href={"https://meet.jit.si/ClassExpress-" + stream.id}
            target="_blank"
          >
            <div className="stream__button stream__button-full clickable">
              Join Practice
            </div>
          </a>
        ) : (
          <>
            <div
              className="stream__attending clickable"
              data-tip
              data-for={"disabled" + stream.id}
            >
              Join Practice
            </div>

            <ReactTooltip
              id={"disabled" + stream.id}
              type="dark"
              effect="solid"
              place="top"
            >
              Attend to get access
            </ReactTooltip>
          </>
        )}

        {!currentUserProfile || !currentUserProfile.uid ? (
          <a href="#sign-up">
            <div className="stream__button stream__button-full clickable">
              Attend
            </div>
          </a>
        ) : endDate < dateNow ||
          currentUserProfile.uid ===
            stream.user_ID ? null : stream.attendants.includes(
            currentUserProfile.uid
          ) ? (
          <div
            className="stream__attending clickable"
            onClick={() => unattand(stream, currentUserProfile.uid)}
          >
            Attending
          </div>
        ) : (
          <div
            className="stream__button stream__button-full clickable"
            onClick={() => attand(stream, currentUserProfile.uid)}
          >
            Attend
          </div>
        )}

        <FollowBtn
          currentUserProfile={currentUserProfile}
          strangerID={stream.user_ID}
          textFollow="Follow Host"
          textUnfollow="Unfollow Host"
        />

        {endDate > dateNow ? (
          <CopyToClipboard
            text={`https://class.express/practice/${stream.id}`}
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

        {endDate > dateNow ? (
          <AddToCalendar
            event={event}
            buttonWrapperClass="stream__button stream__button-line clickable"
            dropdownClass="stream__button stream__button-line clickable"
          />
        ) : null}

        {currentUserProfile && currentUserProfile.uid === stream.user_ID ? (
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
                togglePopup(true);
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
