import React, { useContext, useState, useEffect } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../../../providers/Auth";

import { fetchBlogComments, newComment } from "../../../../../actions/blog";

import CommentForm from "../../../../forms/commentForm";
import Comment from "../../../../otherComponents/comment";

const Comments = ({ postID, fetchBlogComments, newComment }) => {
  const { currentUserProfile } = useContext(AuthContext);

  // This is the array of all the comments
  const [comments, setComments] = useState([]);

  // This is the value of new comment
  const [comment, setComment] = useState([]);

  // This happens when the room first loads. We take the id of the room and also the fake uid (return if it's not set yet) and we fetch the rooms data. There's also a callback for creating a new portal called home in case there aren't any portals in this room yet
  useEffect(() => {
    fetchBlogComments(postID, (coms) => setComments(coms));
  }, [postID, fetchBlogComments]);

  // This sets the comment basic info, and the values of the different fields in our page to what they currently are (so that they'll be present in our edit components)
  useEffect(() => {
    if (!currentUserProfile || !currentUserProfile.uid) return;

    setComment({
      user_ID: currentUserProfile.uid,
      user_name: currentUserProfile.name,
      user_username: currentUserProfile.username,
      user_avatar: currentUserProfile.avatar,
      post_ID: postID,
    });
  }, [currentUserProfile]);

  // Render the comments to the page
  const renderComments = (comments) => {
    return comments.map((com) => {
      return (
        <Comment comment={com} setComments={setComments} key={com.id} blog />
      );
    });
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!currentUserProfile || !comment.body || !comment.body.length) return;
    newComment(comment, (id) => {
      setComments([
        {
          ...comment,
          created_on: new Date(),
          id,
        },
        ...comments,
      ]);
      setComment({ ...comment, body: "" });
    });
  };

  return (
    <div className="comments single-room__comments">
      <CommentForm
        comment={comment}
        setComment={setComment}
        submitComment={submitComment}
      />
      {comments ? renderComments(comments) : null}
    </div>
  );
};

export default connect(null, { fetchBlogComments, newComment })(Comments);
