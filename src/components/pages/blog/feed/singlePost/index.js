import "./styles.scss";
import React from "react";
import Moment from "react-moment";
import { useHistory } from "react-router-dom";

import history from "../../../../../history";

import { titleToUrl } from "../../../../../utils/strings";

import User from "../../../../otherComponents/user/static";

const SinglePost = ({ post }) => {
  const myHistory = useHistory(history);

  const createdOn =
    Object.prototype.toString.call(post.created_on) === "[object Date]"
      ? post.created_on
      : post.created_on.toDate();

  const gotToArticle = () => {
    myHistory.push(`/blog/${titleToUrl(post.title)}-${post.id}`);
  };

  return (
    <div className="single-post max-fr" key={post.id}>
      <img
        className="single-post__image clickable"
        src={post.image || "../../imgs/placeholder.jpg"}
        alt="cover"
        onClick={gotToArticle}
      />
      <div className="single-post__body">
        <div className="single-post__title clickable" onClick={gotToArticle}>
          {post.title}
        </div>
        <div className="single-post__subtitle clickable" onClick={gotToArticle}>
          {post.subtitle}
        </div>
        <div className="fr-max" style={{ width: "100%" }}>
          <User
            user={{
              name: post.user_name,
              username: post.user_username,
              avatar: post.user_avatar,
              uid: post.user_ID,
            }}
          />
          <Moment fromNow className="single-post__timestamp">
            {createdOn}
          </Moment>
        </div>
        {/* <div className="single-post__author">{post.user}</div> */}
      </div>
    </div>
  );
};
export default SinglePost;
