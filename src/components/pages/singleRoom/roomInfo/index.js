import "./styles.scss";
import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Moment from "react-moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ReactSVG } from "react-svg";

import history from "../../../../history";
import firebase from "../../../../firebase";

import { AuthContext } from "../../../../providers/Auth";
import { SearchContext } from "../../../../providers/Search";
import { PageContext } from "../../../../providers/Page";

import {
  addToFavorites,
  removeFromFavorites,
  updateRoom,
} from "../../../../actions";

import { getLanguageName } from "../../../../utils/languages";
import { capitalizeSentances } from "../../../../utils/strings";
import { connect } from "react-redux";
import TextArea from "../../../formComponents/textArea";

const RoomInfo = ({
  room,
  setRoom,
  updateRoom,
  addToFavorites,
  removeFromFavorites,
}) => {
  const myHistory = useHistory(history);

  const { currentUserProfile } = useContext(AuthContext);
  const { setSearchTerm } = useContext(SearchContext);
  const { setPage } = useContext(PageContext);

  // We use this state to hold
  const [values, setValues] = useState({});

  const [shareButton, setShareButton] = useState(null);
  const [isDescriptionEdited, setIsDescriptionEdited] = useState(false);

  // This sets the value of the description field (so that it'll be present in our edit component)
  useEffect(() => {
    if (
      !room ||
      !currentUserProfile ||
      !currentUserProfile.uid ||
      room.user_ID !== currentUserProfile.uid
    )
      return;

    if (room.description)
      setValues((val) => {
        return { ...val, description: room.description };
      });
  }, [currentUserProfile, room]);

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
    <div className="section__container room-info">
      <div className="section__title">Room Info</div>

      <div className="room__top">
        {lastVisit ? (
          <div className="room__last-visit">
            Last visitor joined <Moment fromNow>{lastVisit}</Moment>
          </div>
        ) : null}

        <div
          className="room__title"
          onClick={() => {
            myHistory.push(`/room/${room.id}`);
          }}
        >
          {capitalizeSentances(room.title)}
        </div>

        <div className="room__languages--base">
          Need to know {getLanguageName(room.language)}
        </div>

        {isDescriptionEdited ? (
          <>
            <div className="tiny-margin-bottom">
              <TextArea
                type="text"
                placeHolder="Describe what this Room is about"
                value={values && values.description}
                onChange={(val) => {
                  if (val.length < 300)
                    setValues({ ...values, description: val });
                }}
              />
            </div>

            {currentUserProfile &&
            room &&
            currentUserProfile.uid === room.user_ID ? (
              <div
                className="button-colored"
                onClick={() => {
                  if (values.description) {
                    updateRoom(
                      {
                        ...room,
                        description: values.description,
                      },
                      "description",
                      () => {
                        setIsDescriptionEdited(false);
                      }
                    );
                  }
                }}
              >
                Save
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className="room__description">{room.description}</div>

            {currentUserProfile &&
            room &&
            currentUserProfile.uid === room.user_ID ? (
              <div
                className="button-colored tiny-margin-top"
                onClick={() => setIsDescriptionEdited(true)}
              >
                Edit
              </div>
            ) : null}
          </>
        )}

        <div className="tiny-margin-top">{renderTags()}</div>
      </div>
      <div className="room__actions--pair tiny-margin-top">
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
                src="../svgs/share.svg"
                wrapper="div"
                beforeInjection={(svg) => {
                  svg.classList.add("room__icon");
                }}
              />
            )}
          </div>
        </CopyToClipboard>

        {!currentUserProfile || !currentUserProfile.uid ? (
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
                src="../svgs/heart.svg"
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
            onClick={() =>
              removeFromFavorites(currentUserProfile, room, () => {
                setRoom({
                  ...room,
                  favorites: room.favorites.filter(
                    (fav) => fav !== currentUserProfile.uid
                  ),
                });
              })
            }
          >
            <div className="fr-max-fr">
              <div />
              <ReactSVG
                src="../svgs/heart_full.svg"
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
            onClick={() =>
              addToFavorites(currentUserProfile, room, () => {
                setRoom({
                  ...room,
                  favorites: room.favorites
                  ? [...room.favorites, currentUserProfile.uid]
                  : [currentUserProfile.uid],
                });
              })
            }
          >
            <div className="fr-max-fr">
              <div />
              <ReactSVG
                src="../svgs/heart.svg"
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
  );
};

export default connect(null, {
  updateRoom,
  addToFavorites,
  removeFromFavorites,
})(RoomInfo);
