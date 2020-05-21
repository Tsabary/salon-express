import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import Moment from "react-moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ReactSVG } from "react-svg";
import ShowMoreText from "react-show-more-text";

import history from "../../../history";
import firebase from "firebase/app";

import { SearchContext } from "../../../providers/Search";
import { PageContext } from "../../../providers/Page";

import { getLanguageName } from "../../../utils/languages";
import { capitalizeSentances } from "../../../utils/strings";

const Floor = ({
  floor,
  isForFeed
}) => {
  const myHistory = useHistory(history);

  const { setSearchTerm } = useContext(SearchContext);
  const { setPage } = useContext(PageContext);

  const [shareButton, setShareButton] = useState(null);

  const lastVisit =
    Object.prototype.toString.call(floor.last_visit) === "[object Date]"
      ? floor.last_visit
      : floor.last_visit.toDate();

  const renderTags = () => {
    return floor.tags.map((el) => {
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
      <div className="cover-image__container">
        <img className="cover-image__preview" src={floor.image} />
      </div>
      <div className="room__top">
        <div className="room__content">
          {/* {lastVisit ? (
            <div className="room__last-visit">
              Last visitor joined <Moment fromNow>{lastVisit}</Moment>
            </div>
          ) : null} */}

          <div
            className="room__title clickable"
            onClick={() => {
              myHistory.push(`/floor/${floor.url}`);
            }}
          >
            {capitalizeSentances(floor.name)}
          </div>

          <div style={{ fontFamily: "Gilroybold", color: "#6f00ff" }}>{`${
            Object.keys(floor.rooms).length
          } Rooms`}</div>

          {floor.language !== "lir" ? (
            <div className="room__languages--base extra-tiny-margin-top">
              Need to know {getLanguageName(floor.language)}
            </div>
          ) : null}
          {floor.description ? (
            <ShowMoreText
              lines={3}
              more="Show more"
              less="Show less"
              anchorClass="room__read-more"
            >
              {floor.description}
            </ShowMoreText>
          ) : null}

          {isForFeed ? null : (
            <div className="room__description">{floor.description}</div>
          )}

          <div className="tiny-margin-top"> {renderTags()}</div>
        </div>
      </div>
      <div className="room__actions--all">
        {/* <div className="room__actions--pair"> */}
        <CopyToClipboard
          text={`https://salon.express/floor/${floor.url}`}
          data-tip
          data-for={`share${floor.id}`}
          onCopy={() => {
            shareButtonTimer();
            setShareButton("Share URL copied!");
            firebase.analytics().logEvent("floor_share_link_copied");
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

        {/* {!currentUserProfile.uid ? (
            <a
              onClick={() => {
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
              )} */}

        {/* </div> */}
      </div>
    </div>
  );
};

export default Floor
