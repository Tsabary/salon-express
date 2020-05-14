import "./styles.scss";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import readingTime from "reading-time";
import Moment from "react-moment";

const PostHeader = ({ post }) => {
  const [createdOn, setCreatedOn] = useState(null);

  useEffect(() => {
    if (!post) return;
    setCreatedOn(
      Object.prototype.toString.call(post.created_on) === "[object Date]"
        ? post.created_on
        : post.created_on.toDate()
    );
  }, [post]);

  const wordCount = (string) => {
    return string
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  return (
    <div className="post-header">
      <div className="fr-max">
        <div className="post-header__times">
          Published{" "}
          {true ? (
            <Moment fromNow>{createdOn}</Moment>
          ) : (
            <Moment format="DD/MM/YYYY HH:mm">{createdOn}</Moment>
          )}
        </div>
        <div className="post-header__times">
          {readingTime(wordCount(post.body)).text}
        </div>
      </div>
      <div className="post-header__title">{post.title}</div>
      <div className="post-header__subtitle">{post.subtitle}</div>
    </div>
  );
};

export default connect(null)(PostHeader);
