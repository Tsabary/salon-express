import "./styles.scss";
import React, { useContext, useState, useEffect } from "react";

import { AuthContext } from "../../../../providers/Auth";

import { fetchRoomComments, newComment } from "../../../../actions";
import { connect } from "react-redux";

import Comment from "./comment";

import TextArea from "../../../formComponents/textArea";
import { validateWordsLength } from "../../../../utils/strings";

const Comments = ({ match, room, fetchRoomComments, newComment }) => {
  const { currentUserProfile } = useContext(AuthContext);

  // This is the array of all the comments
  const [comments, setComments] = useState([]);

  // This is the value of new comment
  const [comment, setComment] = useState([]);

  // This happens when the room first loads. We take the id of the room and also the fake uid (return if it's not set yet) and we fetch the rooms data. There's also a callback for creating a new portal called home in case there aren't any portals in this room yet
  useEffect(() => {
    fetchRoomComments(match.params.id, setComments);
  }, [match, fetchRoomComments]);

  // This sets the comment basic info, and the values of the different fields in our page to what they currently are (so that they'll be present in our edit components)
  useEffect(() => {
    if (!room || !currentUserProfile || !currentUserProfile.uid) return;

    setComment({
      user_ID: currentUserProfile.uid,
      user_name: currentUserProfile.name,
      user_username: currentUserProfile.username,
      user_avatar: currentUserProfile.avatar,
      room_ID: room.id,
    });
  }, [currentUserProfile, room]);

  // Render the comments to the page
  const renderComments = (comments) => {
    return comments.map((com) => {
      return <Comment comment={com} key={com.id} />;
    });
  };

  return (
    <div className="comments single-room__comments section__container">
      <form
        className="comments__form"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          if (!currentUserProfile || !comment.body || !comment.body.length)
            return;
          newComment(comment, () => {
            setComments([
              {
                ...comment,
                created_on: new Date(),
                id: Date.now(),
              },
              ...comments,
            ]);
            setComment({ ...comment, body: "" });
          });
        }}
      >
        <TextArea
          type="text"
          placeHolder="Leave a comment"
          value={comment && comment.body ? comment.body : ""}
          onChange={(body) => {
            if (body.length < 500 && validateWordsLength(body, 50))
              setComment({
                ...comment,
                body,
              });
          }}
        />
        {currentUserProfile ? (
          <>
            <button type="submit" className="small-button">
              Post
            </button>
          </>
        ) : (
          <>
            <div
              className="small-button"
              onClick={() => (window.location.hash = "sign-up")}
            >
              Post
            </div>
          </>
        )}
      </form>
      {comments ? renderComments(comments) : null}
    </div>
  );
};

export default connect(null, { fetchRoomComments, newComment })(Comments);
