import "./styles.scss";
import React from "react";
import { useHistory } from "react-router-dom";

import Moment from "react-moment";

import history from "../../../../history";

const Comment = ({ comment }) => {
  const myHistory = useHistory(history);

  const createdOn =
    Object.prototype.toString.call(comment.created_on) === "[object Date]"
      ? comment.created_on
      : comment.created_on.toDate();

  return (
    <div className="comment">
      <div
        className="fr-max"
        onClick={() => myHistory.push(`/${comment.user_username}`)}
      >
        <div className="max-fr">
          <img className="comment__avatar" src={comment.user_avatar} />
          <div className="comment__user-name">{comment.user_name}</div>
        </div>
        <div className="comment__time">
          <Moment fromNow>{createdOn}</Moment>
        </div>
      </div>
      <div className="comment__body">{comment.body}</div>
    </div>
  );
};

export default Comment;
