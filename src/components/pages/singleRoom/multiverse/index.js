import React, { useState, useContext } from "react";

import { AuthContext } from "../../../../providers/Auth";
import { titleToKey } from "../../../../utils/strings";
import { newPortal } from "../../../../actions";

import Portal from "./portal";
import InputField from "../../../formComponents/inputField";
import BoxedButton from "../../../formComponents/boxedButton";
import { connect } from "react-redux";

const Multiverse = ({
  room,
  values,
  setValues,
  multiverse,
  currentPortal,
  setCurrentPortal,
  multiverseArray,
  newPortal,
}) => {
  const { currentUserProfile } = useContext(AuthContext);

  // This holdes the portal error if any (currently only one is "a portal with a similar name exists")
  const [portalError, setPortalError] = useState(null);

  // Render the portals to the page
  const renderPortals = (multiverse) => {
    return multiverse.map((portal) => {
      return (
        <Portal
          portal={portal}
          members={portal.members}
          currentPortal={currentPortal}
          setCurrentPortal={setCurrentPortal}
          key={titleToKey(portal.title)}
        />
      );
    });
  };

  return (
    <div className="single-room__container-multiverse section__container tiny-margin-top">
      <div className="section__title">The Multiverse</div>
      <form
        className="single-room__multiverse-form"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          if (
            !currentUserProfile ||
            !values ||
            !values.portal ||
            !values.portal.length
          )
            return;

          if (
            multiverse.hasOwnProperty(
              values.portal.trim().split(" ").join("").toLowerCase()
            )
          ) {
            setPortalError("A portal with that name already exists");
            return;
          }

          newPortal(
            values.portal,
            currentPortal,
            room,
            currentUserProfile.uid,
            (portalObj) => {
              setValues({ ...values, portal: "" });
              setCurrentPortal(portalObj);
              setPortalError(null);
            }
          );
        }}
      >
        <InputField
          type="text"
          placeHolder="Open a portal"
          value={values.portal}
          onChange={(portal) => {
            if (portal.length < 30) setValues({ ...values, portal });
          }}
        />

        {currentUserProfile ? (
          <>
            <button
              type="submit"
              className="boxed-button single-room__comment--boxed"
            >
              Open
            </button>

            <button
              type="submit"
              className="text-button-mobile  single-room__comment--text"
            >
              Open
            </button>
          </>
        ) : (
          <a href="#sign-up" className="auth-options__box">
            <BoxedButton text="Open" />
          </a>
        )}
      </form>
      {portalError ? (
        <div className="form-error tiny-margin-top">{portalError}</div>
      ) : null}

      <div className="single-room__portals">
        {multiverseArray ? renderPortals(multiverseArray) : null}
      </div>
    </div>
  );
};

export default connect(null, { newPortal })(Multiverse);
