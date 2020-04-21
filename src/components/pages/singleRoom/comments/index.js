import "./styles.scss";
import React, { useContext } from "react";

import { AuthContext } from "../../../../providers/Auth";

import { newComment } from "../../../../actions";
import { connect } from "react-redux";

import Comment from "./comment";

import TextArea from "../../../formComponents/textArea";


const Comments = ({ values, setValues, comments, setComments, newComment }) => {
  const { currentUserProfile } = useContext(AuthContext);

  // Render the comments to the page
  const renderComments = (comments) => {
    return comments.map((com) => {
      return <Comment comment={com} key={com.id} />;
    });
  };

  return (
    <div className="single-room__container-comments single-room__comments">
      <form
        className="fr-max"
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
          value={values && values.comment && values.comment.body}
          onChange={(body) => {
            if (body.length < 500)
              setValues({
                ...values,
                comment: { ...values.comment, body },
              });
          }}
        />
        {currentUserProfile ? (
          <>
            <button
              type="submit"
              className="boxed-button single-room__comment--boxed"
            >
              Comment
            </button>

            <button
              type="submit"
              className="text-button-mobile single-room__comment--text"
            >
              Comment
            </button>
          </>
        ) : (
          <>
            <a
              href="#sign-up"
              className="boxed-button single-room__comment--boxed"
            >
              Comment
            </a>

            <a
              href="#sign-up"
              className="text-button-mobile single-room__comment--text"
            >
              Comment
            </a>
          </>
        )}
      </form>
      {comments ? renderComments(comments) : null}
    </div>
  );
};

export default connect(null, { newComment })(Comments);
