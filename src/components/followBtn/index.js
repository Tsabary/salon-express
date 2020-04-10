import "./styles.scss";
import React, { useState, useContext } from "react";

import Loader from "react-loader-spinner";
import { connect } from "react-redux";

import { follow, unfollow } from "../../actions";
import { AuthContext } from "../../providers/Auth";

const FollowBtn = ({ follow, unfollow, currentUserProfile, strangerID, textFollow, textUnfollow }) => {
  const { setCurrentUserProfile } = useContext(AuthContext);

  const [handlingFollow, setHandlingFollow] = useState(false);

  return !currentUserProfile.uid ||
    currentUserProfile.uid ===
      strangerID ? <div/> : !currentUserProfile.following.includes(strangerID) ? (
    <div
      className="stream__button stream__button-full clickable"
      onClick={() => {
        follow(currentUserProfile, strangerID, setCurrentUserProfile, () =>
          setHandlingFollow(false)
        );
        setHandlingFollow(true);
      }}
    >
      {handlingFollow ? (
        <div className="centered">
          <Loader type="ThreeDots" color="#ffffff" height={20} width={20} />
        </div>
      ) : (
        textFollow
      )}
    </div>
  ) : (
    <div
      className="stream__button stream__button-line clickable"
      onClick={() => {
        {
          unfollow(currentUserProfile, strangerID, setCurrentUserProfile, () =>
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
