import "./styles.scss";
import React, { useContext, useState, useEffect } from "react";

import ReactTooltip from "react-tooltip";
import { Emoji, Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

import { AuthContext } from "../../../../../../providers/Auth";

import { newPortal } from "../../../../../../actions/portals";
import { connect } from "react-redux";

const MultiverseForm = ({
  entityID,
  multiverse,
  currentPortal,
  setCurrentPortal,
  newPortal,
}) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [newPortalValues, setNewPortalValues] = useState({});
  // This holdes the portal error if any (currently only one is "a portal with a similar name exists")
  const [portalError, setPortalError] = useState(null);

  useEffect(() => {
    if (!currentUserProfile) return;
    setNewPortalValues({ ...newPortalValues, user_ID: currentUserProfile.uid });
  }, [currentUserProfile]);

  const addEmoji = (emo) => {
    setNewPortalValues({ ...newPortalValues, totem: emo });
  };

  return (
    <form
      className="multiverse-form"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        if (
          !currentUserProfile ||
          (newPortalValues && !newPortalValues.title) ||
          !newPortalValues.title.length
        )
          return;

        if (
          multiverse.hasOwnProperty(
            newPortalValues.title.trim().split(" ").join("").toLowerCase()
          )
        ) {
          setPortalError("A portal with that name already exists");
          return;
        }

        newPortal(
          newPortalValues,
          currentPortal.new,
          entityID,
          currentUserProfile.uid,
          (portalObj) => {
            setNewPortalValues({});
            setCurrentPortal((val) => {
              return { new: portalObj, old: val.new };
            });
            setPortalError(null);
          }
        );
      }}
    >
      <div className="fr-max">
        <div className="multiverse-form__input-container">
          <div className="multiverse-form__emoji">
            {newPortalValues && newPortalValues.totem ? (
              <div className="extra-tiny-margin-top">
                <Emoji emoji={newPortalValues.totem} size={16} />
              </div>
            ) : (
              <img
                className="multiverse-form__emoji-current"
                src="../../../imgs/emoji.png"
              />
            )}

            <div className="multiverse-form__emoji-picker">
              <Picker
                set="apple"
                onSelect={addEmoji}
                title="Pick your emoji…"
                emoji="point_up"
                i18n={{
                  search: "Search",
                  categories: {
                    search: "Search Results",
                    recent: "Recents",
                  },
                }}
              />
            </div>
          </div>

          <input
            className="multiverse-form__input"
            style={{ border: "none", outline: "none" }}
            id="Open a portal"
            type="text"
            placeholder="Open a portal"
            value={newPortalValues.title || ""}
            onChange={(e) => {
              if (e.target.value.length < 30)
                setNewPortalValues({
                  ...newPortalValues,
                  title: e.target.value
                    .replace(/^([^-]*-)|-/g, "$1")
                    .replace(/[^\p{L}\s\d-]+/gu, ""),
                });
            }}
          />
        </div>
        <div
          className="info extra-tiny-margin-top"
          data-tip="portalInfo"
          data-for="portalInfo"
        />
        <ReactTooltip place="bottom" id="portalInfo">
          <div
            dangerouslySetInnerHTML={{
              __html:
                'A "Portal" is a video chat. Every Portal you open is a seperate video chat to all the others.',
            }}
          />
        </ReactTooltip>
      </div>

      {currentUserProfile ? (
        <button type="submit" className="small-button">
          Open
        </button>
      ) : (
        <div
          className="small-button"
          onClick={() => (window.location.hash = "sign-up")}
        >
          Open
        </div>
      )}
      {portalError ? (
        <div className="form-error tiny-margin-top">{portalError}</div>
      ) : null}
    </form>
  );
};

export default connect(null, { newPortal })(MultiverseForm);
