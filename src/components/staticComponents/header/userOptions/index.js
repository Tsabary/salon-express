import "./styles.scss";
import React, { useState, useContext, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import firebase from "firebase/app";
import { AuthContext } from "../../../../providers/Auth";

import { logOut, resendVerification } from "../../../../actions";

import TextButton from "../../../formComponents/textButton";

const UserOptions = ({ logOut, resendVerification, isFloor }) => {
  const { currentUserProfile, currentUser } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (
      currentUserProfile &&
      currentUserProfile.roles &&
      currentUserProfile.roles.includes("admin")
    ) {
      setIsAdmin(true);
    }

    if (currentUserProfile && currentUserProfile.languages) {
      firebase
        .analytics()
        .setUserProperties({ languages: currentUserProfile.languages });
    }
  }, [currentUserProfile]);

  return (
    <div className="user-options">
      <div className="user-options__container-full">
        <div
          className={
            isFloor ? "user-options__name user-options__name--floor" : "user-options__name"
          }
        >
          {!!currentUserProfile ? currentUserProfile.name : currentUser.email}
        </div>
        <div className="user-options__image-container ">
          <img
            className="user-options__image"
            src={
              (currentUserProfile && currentUserProfile.avatar) ||
              "../imgs/avatar.png"
            }
          />
        </div>
      </div>

      <div className="user-options__container-lean">
        <div className="user-options__image-container ">
          <img
            className="user-options__image"
            src={
              (currentUserProfile && currentUserProfile.avatar) ||
              "../../../imgs/logo.jpeg"
            }
          />
        </div>
      </div>

      <div className="user-options__options">
        <div
          className="user-options__option"
          onClick={() => {
            window.location.hash = "update-profile";
            firebase.analytics().logEvent("profile_update_clicked");
          }}
        >
          <TextButton text="Update Profile" />
        </div>

        <div className="user-options__option" onClick={() => logOut()}>
          Log Out
        </div>
      </div>
    </div>
  );
};
export default connect(null, { logOut, resendVerification })(UserOptions);
