import "./styles.scss";
import React, { useContext, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Moment from "react-moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ReactSVG } from "react-svg";

import history from "../../history";
import firebase from "../../firebase";

import { SearchContext } from "../../providers/Search";
import { PageContext } from "../../providers/Page";

import {
  logGuestEntry,
  addToFavorites,
  removeFromFavorites,
  togglePopup,
} from "../../actions";
import { getLanguageName } from "../../utils/languages";
import { capitalizeSentances } from "../../utils/strings";

const Room = ({
  room,
  logGuestEntry,
  addToFavorites,
  removeFromFavorites,
  currentUserProfile,
  togglePopup,
  isForFeed,
}) => {
  const myHistory = useHistory(history);

  const { setSearchTerm } = useContext(SearchContext);
  const { setPage } = useContext(PageContext);

  const [shareButton, setShareButton] = useState(null);

  const lastVisit =
    Object.prototype.toString.call(room.last_visit) === "[object Date]"
      ? room.last_visit
      : room.last_visit.toDate();

  const renderTags = () => {
    return room.tags.map((el) => {
      return (
        <div
          className="room__tag"
          key={el}
          onClick={() => {
            setPage(5);
            setSearchTerm(el);
            firebase.analytics().logEvent("search_from_tag_click");
          }}
        >
          {el}
        </div>
      );
    });
  };

  const shareButtonTimer = () => {
    setTimeout(() => {
      setShareButton(null);
    }, 3000);
  };

  return (
    <div className={isForFeed ? "room room-feed" : "room"}>
      <input
        className="room-delete-checkbox"
        type="checkbox"
        id={`room-delete-checkbox` + room.id}
      />
      <span className="room__visible">
        <div className="room__top">
          <div className="room__content">
            {lastVisit ? (
              <div className="room__last-visit">
                Last visitor joined <Moment fromNow>{lastVisit}</Moment>
              </div>
            ) : null}

            <div
              className="room__title"
              onClick={() => {
                myHistory.push(`/room/${room.id}`);
                logGuestEntry(room, currentUserProfile);
              }}
            >
              {capitalizeSentances(room.title)}
            </div>

            <div className="room__languages--base">
              Need to know {getLanguageName(room.language)}
            </div>

            {isForFeed ? null :
              <div className="room__description">{room.description}</div>}

            <div className="tiny-margin-top"> {renderTags()}</div>
          </div>
        </div>
        <div className="room__actions--all">
          {/* <a
            href={"https://meet.jit.si/ClassExpress-" + room.id}
            target="_blank"
            onClick={() => logGuestEntry(room, currentUserProfile)}
          >
            <div className="room__button room__button-full clickable">
              Enter Room
            </div>
          </a> */}

          <div className="room__actions--pair">
            <CopyToClipboard
              text={`https://salon.express/room/${room.id}`}
              data-tip
              data-for={`share${room.id}`}
              onCopy={() => {
                shareButtonTimer();
                setShareButton("Share URL copied!");
                firebase.analytics().logEvent("room_share_link_copied");
              }}
            >
              <div className="room__button room__button-line clickable">
                {shareButton ? (
                  shareButton
                ) : (
                  <ReactSVG
                    src="./svgs/share.svg"
                    wrapper="div"
                    beforeInjection={(svg) => {
                      svg.classList.add("room__icon");
                    }}
                  />
                )}
              </div>
            </CopyToClipboard>

            {!currentUserProfile.uid ? (
              <a
                onClick={() => {
                  togglePopup(true);
                  firebase.analytics().logEvent("favorites_clicked_not_user");
                }}
                className="room__button room__button-line clickable"
                href={"#sign-up"}
              >
                <div className="fr-max-fr">
                  <div />
                  <ReactSVG
                    src="./svgs/heart.svg"
                    wrapper="div"
                    beforeInjection={(svg) => {
                      svg.classList.add("room__icon");
                    }}
                  />
                  <div />
                </div>
              </a>
            ) : room.favorites &&
              room.favorites.includes(currentUserProfile.uid) ? (
              <div
                className="room__button room__button-line clickable"
                onClick={() => removeFromFavorites(currentUserProfile, room)}
              >
                <div className="fr-max-fr">
                  <div />
                  <ReactSVG
                    src="./svgs/heart_full.svg"
                    wrapper="div"
                    beforeInjection={(svg) => {
                      svg.classList.add("room__icon");
                    }}
                  />
                  <div />
                </div>
              </div>
            ) : (
              <div
                className="room__button room__button-line clickable"
                onClick={() => addToFavorites(currentUserProfile, room)}
              >
                <div className="fr-max-fr">
                  <div />
                  <ReactSVG
                    src="./svgs/heart.svg"
                    wrapper="div"
                    beforeInjection={(svg) => {
                      svg.classList.add("room__icon");
                    }}
                  />
                  <div />
                </div>
              </div>
            )}
          </div>
        </div>
      </span>
      <span className="room__hidden">
        {/* <div>Are you sure you want to delete this event?</div>
        <div className="room__actions small-margin-top">
          <label
            className="room-button room-button__normal"
            htmlFor={`room-delete-checkbox` + room.id}
          >
            Cancel
          </label>

          <label
            className="room-button room-button__delete"
            htmlFor={`room-delete-checkbox` + room.id}
            onClick={() => removeRoom(room)}
          >
            Delete
          </label>
        </div> */}
      </span>
    </div>
  );
};

export default connect(null, {
  logGuestEntry,
  addToFavorites,
  removeFromFavorites,
  togglePopup,
})(Room);
