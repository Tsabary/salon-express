import "./styles.scss";
import React, { useState, useContext } from "react";

import Loader from "react-loader-spinner";
import { connect } from "react-redux";

import { follow, unfollow } from "../../../actions/profiles";
import { AuthContext } from "../../../providers/Auth";

const FollowBtn = ({
  follow,
  unfollow,
  currentUserProfile,
  strangerID,
  textFollow,
  textUnfollow,
}) => {
  const [handlingFollow, setHandlingFollow] = useState(false);

  return !currentUserProfile ||
    (currentUserProfile && !currentUserProfile.uid) ||
    (currentUserProfile && currentUserProfile.uid === strangerID) ? (
    <div className="follow-btn__empty" />
  ) : (currentUserProfile && !currentUserProfile.following) ||
    (currentUserProfile.following &&
      !currentUserProfile.following.includes(strangerID)) ? (
    <div
      className="follow-btn follow-btn--full clickable"
      onClick={() => {
        follow(currentUserProfile, strangerID, () => setHandlingFollow(false));
        setHandlingFollow(true);
      }}
    >
      {handlingFollow ? (
        <div className="centered">
          <Loader type="ThreeDots" color="#6f00ff" height={20} width={20} />
        </div>
      ) : (
        textFollow
      )}
    </div>
  ) : (
    <div
      className="follow-btn follow-btn--line clickable"
      onClick={() => {
        {
          unfollow(currentUserProfile, strangerID, () =>
            setHandlingFollow(false)
          );
          setHandlingFollow(true);
        }
      }}
    >
      {handlingFollow ? (
        <div className="centered">
          <Loader type="ThreeDots" color="#6f00ff" height={20} width={20} />
        </div>
      ) : (
        textUnfollow
      )}
    </div>
  );
};

export default connect(null, { follow, unfollow })(FollowBtn);
