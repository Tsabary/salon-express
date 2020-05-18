import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";

import { fetchProfileByUid } from "../../../actions/profiles";
import FollowBtn from "../../otherComponents/followBtn";
import { AuthContext } from "../../../providers/Auth";
import Social from "../../otherComponents/social";

const UserSocial = ({ uid, fetchProfileByUid, horizontal }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const [user, setAuthor] = useState(null);

  useEffect(() => {
    if (user) return;
    fetchProfileByUid(uid, (profile) => setAuthor(profile));
  });

  return user ? (
    <div className={horizontal? "user-social max-fr-fr": "user-social max-fr"}>
      <div className="user-social__avatar-container">
        <img
          className="user-social__avatar"
          src={user.avatar ? user.avatar : "../../../imgs/avatar.png"}
          alt="user"
        />
      </div>
      <div className="user-social__details">
        <div className="user-social__name">
          {`${user.name} ${
            user.username === user.uid ? "" : `(${user.username})`
          }`}
        </div>

        <FollowBtn
          currentUserProfile={currentUserProfile}
          strangerID={user.uid}
          textFollow="Follow"
          textUnfollow="Unfollow"
        />
      </div>
      {!horizontal? <div/> :null}
      <Social data={user} />
    </div>
  ) : null;
};

export default connect(null, { fetchProfileByUid })(UserSocial);
