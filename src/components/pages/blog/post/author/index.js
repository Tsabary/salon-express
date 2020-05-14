import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";

import { fetchProfileByUid } from "../../../../../actions/profiles";
import FollowBtn from "../../../../otherComponents/followBtn";
import { AuthContext } from "../../../../../providers/Auth";
import Social from "../../../../otherComponents/social";

const Author = ({ post, fetchProfileByUid }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    console.log("authoor", author);
  });

  useEffect(() => {
    if (author) return;
    fetchProfileByUid(post.user_ID, (profile) => setAuthor(profile));
  });

  return author ? (
    <div className="author">
      <div className="author__avatar-container">
        <img
          className="author__avatar"
          src={author.avatar ? author.avatar : "../../../imgs/avatar.png"}
          alt="user"
        />
      </div>
      <div className="author__details">
        <div className="author__name">
          {`${author.name} ${
            author.username === author.uid ? "" : `(${author.username})`
          }`}
        </div>

        <FollowBtn
          currentUserProfile={currentUserProfile}
          strangerID={author.uid}
          textFollow="Follow"
          textUnfollow="Unfollow"
        />
      </div>
      <Social data={author} />
    </div>
  ) : null;
};

export default connect(null, { fetchProfileByUid })(Author);
