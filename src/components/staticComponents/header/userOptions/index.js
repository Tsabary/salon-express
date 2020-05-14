import "./styles.scss";
import React, { useState, useContext, useEffect } from "react";
import { connect } from "react-redux";
import firebase from "firebase/app";
import { useToasts } from "react-toast-notifications";

import history from "../../../../history";

import { AuthContext } from "../../../../providers/Auth";

import { logOut, resendVerification } from "../../../../actions/users";
import { useHistory } from "react-router-dom";

const UserOptions = ({ logOut, resendVerification, isFloor }) => {
  const myHistory = useHistory(history);
  const { currentUserProfile, currentUser } = useContext(AuthContext);
  const { addToast } = useToasts();

  // const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // if (
    //   currentUserProfile &&
    //   currentUserProfile.roles &&
    //   currentUserProfile.roles.includes("admin")
    // ) {
    //   setIsAdmin(true);
    // }

    if (currentUserProfile && currentUserProfile.languages) {
      firebase
        .analytics()
        .setUserProperties({ languages: currentUserProfile.languages });
    }
  }, [currentUserProfile, currentUser]);

  return (
    <div className="user-options">
      <div className="user-options__container-full">
        <div
          className={
            isFloor
              ? "user-options__name user-options__name--floor"
              : "user-options__name"
          }
        >
          {currentUserProfile ? currentUserProfile.name : currentUser.email}
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

      <div className="user-options__options text-button">
        <div
          className="user-options__option"
          onClick={() => {
            myHistory.push("/blog/new");
            firebase.analytics().logEvent("blog_new_pot_clicked");
          }}
        >
          Write a blog post
        </div>

        <div
          className="user-options__option"
          onClick={() => {
            window.location.hash = "update-profile";
            firebase.analytics().logEvent("profile_update_clicked");
          }}
        >
          Update Profile
        </div>
        {!currentUser.emailVerified ? (
          <div
            className="user-options__option"
            onClick={() => {
              resendVerification(() => {
                addToast("Check your inbox for our verification email", {
                  appearance: "success",
                  autoDismiss: true,
                });
              });
              firebase
                .analytics()
                .logEvent("profile_email_verification_requested");
            }}
          >
            Verify you email
          </div>
        ) : null}

        <div className="user-options__option" onClick={() => logOut()}>
          Log Out
        </div>
      </div>
    </div>
  );
};
export default connect(null, { logOut, resendVerification })(UserOptions);
