import "./styles.scss";
import React, { useContext, useState, useEffect } from "react";
import { connect } from "react-redux";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { ReactSVG } from "react-svg";

import firebase from "firebase/app";

import { AuthContext } from "../../../../../providers/Auth";
import { SearchContext } from "../../../../../providers/Search";
import { PageContext } from "../../../../../providers/Page";

import {
  addToFavorites,
  removeFromFavorites,
  updateRoom,
} from "../../../../../actions/rooms";

import { getLanguageName } from "../../../../../utils/languages";
import {
  capitalizeSentances,
  validateWordsLength,
} from "../../../../../utils/strings";
import { errorMessages } from "../../../../../utils/forms";

import TextArea from "../../../../formComponents/textArea";
import InputField from "../../../../formComponents/inputField";
import Tags from "../../../../formComponents/tags";

const RoomInfo = ({
  room,
  setRoom,
  isOwner,
  floor,
  updateRoom,
  addToFavorites,
  removeFromFavorites,
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { setSearchTerm } = useContext(SearchContext);
  const { setPage } = useContext(PageContext);

  // We use this state to hold
  const [values, setValues] = useState({});
  const [lastSavedValues, setLastSavedValues] = useState({});

  const [shareButton, setShareButton] = useState(null);
  const [isDescriptionEdited, setIsDescriptionEdited] = useState(false);
  const [isNameEdited, setIsNameEdited] = useState(false);
  const [isTagsEdited, setIsTagsEdited] = useState(false);

  const [tagsFormError, setTagsFormError] = useState("");

  // This sets the value of the description field (so that it'll be present in our edit component)
  useEffect(() => {
    if (!room) return;
    setValues((val) => {
      return {
        ...val,
        description: room.description,
        title: room.title,
        name: room.name,
        tags: room.tags,
      };
    });
  }, [currentUserProfile, room]);

  const renderTags = (tags) => {
    return tags.map((el) => {
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

  return room ? (
    <div
      className={
        (room && (room.accepting_donations || room.selling_merch)) || isOwner
          ? "room-info details__info--with-donations section__container"
          : "room-info details__info--without-donations section__container"
      }
    >
      <div className="section__title">Room Info</div>

      <div className="room__top">
        {isNameEdited ? (
          <>
            <div className="tiny-margin-bottom tiny-margin-top">
              <InputField
                type="text"
                placeHolder="Room name"
                value={values && values.name}
                onChange={(name) => {
                  if (name.length < 80 && validateWordsLength(name, 25))
                    setValues({ ...values, name });
                }}
              />
            </div>

            {isOwner ? (
              <div
                className="button-colored"
                onClick={() => {
                  if (values.name) {
                    updateRoom(
                      {
                        ...room,
                        name: values.name,
                      },
                      "name",
                      () => {
                        setIsNameEdited(false);
                        setLastSavedValues({
                          ...lastSavedValues,
                          name: values.name,
                        });
                      }
                    );
                  }
                }}
              >
                Save name
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className="room__title">
              {values.name ? capitalizeSentances(values.name) : null}
            </div>

            {isOwner && !floor ? (
              <div
                className="button-colored"
                onClick={() => setIsNameEdited(true)}
              >
                Edit name
              </div>
            ) : null}
          </>
        )}

        {room.language && room.language !== "lir" ? (
          <div className="room__languages--base extra-tiny-margin-top">
            Need to know {getLanguageName(room.language)}
          </div>
        ) : null}

        {isDescriptionEdited ? (
          <>
            <div className="tiny-margin-bottom tiny-margin-top">
              <TextArea
                type="text"
                placeHolder="Describe what this Room is about"
                value={values && values.description}
                onChange={(val) => {
                  if (val.length < 600)
                    setValues({ ...values, description: val });
                }}
              />
            </div>

            {isOwner ? (
              <div className="max-max">
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
                          setLastSavedValues({
                            ...lastSavedValues,
                            description: values.description,
                          });
                        }
                      );
                    }
                  }}
                >
                  Save description
                </div>
                <div
                  className="button-colored"
                  onClick={() => {
                    setValues((val) => {
                      return {
                        ...val,
                        description: lastSavedValues.description,
                      };
                    });
                    setIsDescriptionEdited(false);
                  }}
                >
                  Cancel
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className="room__description tiny-margin-top">
              {values.description}
            </div>

            {isOwner && !floor ? (
              <div
                className="button-colored"
                onClick={() => setIsDescriptionEdited(true)}
              >
                Edit description
              </div>
            ) : null}
          </>
        )}

        {isTagsEdited ? (
          <>
            <div className="tiny-margin-bottom tiny-margin-top">
              <Tags
                values={values}
                setValues={setValues}
                errorMessages={errorMessages}
                formError={tagsFormError}
                setFormError={setTagsFormError}
              />
            </div>

            {isOwner ? (
              <div className="max-max">
                <div
                  className="button-colored"
                  onClick={() => {
                    if (values.tags) {
                      updateRoom(
                        {
                          ...room,
                          tags: values.tags,
                        },
                        "tags",
                        () => {
                          setIsTagsEdited(false);
                          setLastSavedValues({
                            ...lastSavedValues,
                            tags: values.tags,
                          });
                        }
                      );
                    }
                  }}
                >
                  Save tags
                </div>
                <div
                  className="button-colored"
                  onClick={() => {
                    setValues((val) => {
                      return {
                        ...val,
                        tags: lastSavedValues.tags,
                      };
                    });
                    setIsTagsEdited(false);
                  }}
                >
                  Cancel
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <>
            {values.tags && !floor ? (
              <div className="tiny-margin-top">{renderTags(values.tags)}</div>
            ) : null}

            {isOwner && !floor ? (
              <div
                className="button-colored"
                onClick={() => setIsTagsEdited(true)}
              >
                Edit tags
              </div>
            ) : null}
          </>
        )}
      </div>
      {!floor ? (
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
                    svg.classList.add("svg-icon--normal");
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
                    svg.classList.add("svg-icon--normal");
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
                    svg.classList.add("svg-icon--normal");
                  }}
                />
                <div />
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  ) : null;
};

export default connect(null, {
  updateRoom,
  addToFavorites,
  removeFromFavorites,
})(RoomInfo);
