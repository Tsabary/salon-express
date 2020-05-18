import './styles.scss';
import React, { useContext } from "react";

import TextArea from "../../formComponents/textArea";
import { validateWordsLength } from "../../../utils/strings";
import { AuthContext } from "../../../providers/Auth";

const CommentForm = ({ comment, setComment, submitComment, }) => {
  const { currentUserProfile } = useContext(AuthContext);

  return (
    <form
      className="comments-form"
      autoComplete="off"
      onSubmit={(e) => {
        submitComment(e);
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
        <div className="comments-form__button">
          <button type="submit" className="small-button">
            Post
          </button>
        </div>
      ) : (
        <>
          <div
            className="small-button comments-form__button"
            onClick={() => (window.location.hash = "sign-up")}
          >
            Post
          </div>
        </>
      )}
    </form>
  );
};

export default CommentForm;
