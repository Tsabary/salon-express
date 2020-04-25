import "./styles.scss";
import React, { useContext, useEffect } from "react";

import { AuthContext } from "../../../../providers/Auth";

import { newComment } from "../../../../actions";
import { connect } from "react-redux";

import Comment from "./comment";

import TextArea from "../../../formComponents/textArea";
import { validateWordsLength } from "../../../../utils/strings";

const Comments = ({
  values,
  setValues,
  comments,
  setComments,
  room,
  newComment,
}) => {
  const { currentUserProfile } = useContext(AuthContext);

  // This sets the comment basic info, and the values of the different fields in our page to what they currently are (so that they'll be present in our edit components)
  useEffect(() => {
    if (!room || !currentUserProfile || !currentUserProfile.uid) return;

    setValues({
      comment: {
        user_ID: currentUserProfile.uid,
        user_name: currentUserProfile.name,
        user_username: currentUserProfile.username,
        user_avatar: currentUserProfile.avatar,
        room_ID: room.id,
      },
    });
  }, [currentUserProfile, room]);

  // Render the comments to the page
  const renderComments = (comments) => {
    return comments.map((com) => {
      return <Comment comment={com} key={com.id} />;
    });
  };

  return (
    <div className="single-room__container-comments single-room__comments">
      <form
        className="comments__form"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          if (
            !currentUserProfile ||
            !values ||
            !values.comment.body ||
            !values.comment.body.length
          )
            return;
          newComment(values.comment, () => {
            setComments([
              {
                ...values.comment,
                created_on: new Date(),
                id: Date.now(),
              },
              ...comments,
            ]);
            setValues({ comment: { ...values.comment, body: "" } });
          });
        }}
      >
        <TextArea
          type="text"
          placeHolder="Leave a comment"
          value={
            values && values.comment && values.comment.body
              ? values.comment.body
              : ""
          }
          onChange={(body) => {
            if (body.length < 500 && validateWordsLength(body, 50))
              setValues({
                ...values,
                comment: { ...values.comment, body },
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
            <a href="#sign-up" className="comments__post">
              Post
            </a>
          </>
        )}
      </form>
      {comments ? renderComments(comments) : null}
    </div>
  );
};

export default connect(null, { newComment })(Comments);
