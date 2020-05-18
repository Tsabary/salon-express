import "./styles.scss";
import React, { useContext, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Moment from "react-moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ReactSVG } from "react-svg";
import ShowMoreText from "react-show-more-text";

import history from "../../../history";
import firebase from "firebase/app";

import { SearchContext } from "../../../providers/Search";
import { PageContext } from "../../../providers/Page";

import { addToFavorites, removeFromFavorites } from "../../../actions/rooms";

import { getLanguageName } from "../../../utils/languages";
import { capitalizeSentances, titleToUrl } from "../../../utils/strings";

const Room = ({
  room,
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
      {room && room.image ? (
        <div className="room__cover-img">
          <img
            src={room.image}
            alt="Room"
          />
        </div>
      ) : null}
      <div className="room__top">
        <div className="room__content">
          {lastVisit ? (
            <div className="room__last-visit">
              Last visitor joined <Moment fromNow>{lastVisit}</Moment>
            </div>
          ) : null}

          <div
            className="room__title clickable"
            onClick={() => {
              myHistory.push(`/room/${titleToUrl(room.name)}-${room.id}`);
            }}
          >
            {capitalizeSentances(room.name)}
          </div>

          {room.language !== "lir" ? (
            <div className="room__languages--base extra-tiny-margin-top">
              Need to know {getLanguageName(room.language)}
            </div>
          ) : null}
          {room.description ? (
            <ShowMoreText
              lines={3}
              more="Show more"
              less="Show less"
              anchorClass="room__read-more"
            >
              {room.description}
            </ShowMoreText>
          ) : null}

          {isForFeed ? null : (
            <div className="room__description">{room.description}</div>
          )}

          <div className="tiny-margin-top"> {renderTags()}</div>
        </div>
      </div>
      <div className="room__actions--all">
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
                  src={isForFeed ? "./svgs/share.svg" : "../svgs/share.svg"}
                  wrapper="div"
                  beforeInjection={(svg) => {
                    svg.classList.add("svg-icon--normal");
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
                  src={isForFeed ? "./svgs/heart.svg" : "../svgs/heart.svg"}
                  wrapper="div"
                  beforeInjection={(svg) => {
                    svg.classList.add("svg-icon--normal");
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
                  src={
                    isForFeed
                      ? "./svgs/heart_full.svg"
                      : "../svgs/heart_full.svg"
                  }
                  wrapper="div"
                  beforeInjection={(svg) => {
                    svg.classList.add("svg-icon--normal");
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
                  src={isForFeed ? "./svgs/heart.svg" : "../svgs/heart.svg"}
                  wrapper="div"
                  beforeInjection={(svg) => {
                    svg.classList.add("svg-icon--normal");
                  }}
                />
                <div />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default connect(null, {
  addToFavorites,
  removeFromFavorites,
})(Room);
