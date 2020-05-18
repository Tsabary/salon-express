import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";

import history from "../../../history";

import { AuthContext } from "../../../providers/Auth";
import { validateWordsLength } from "../../../utils/strings";
import { updateComment, deleteComment } from "../../../actions/rooms";
import {
  updateComment as updateCommentBlog,
  deleteComment as deleteCommentBlog,
} from "../../../actions/blog";
import TextArea from "../../formComponents/textArea";

const Comment = ({
  comment,
  setComments,
  blog,
  updateComment,
  deleteComment,
  updateCommentBlog,
  deleteCommentBlog,
}) => {
  const myHistory = useHistory(history);
  const { currentUserProfile } = useContext(AuthContext);

  const [isOwner, setIsOwner] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [values, setValues] = useState("");
  const [lastSavedValues, setLastSavedValues] = useState({});

  const createdOn =
    Object.prototype.toString.call(comment.created_on) === "[object Date]"
      ? comment.created_on
      : comment.created_on.toDate();

  useEffect(() => {
    setValues(comment.body);
  }, [comment]);

  useEffect(() => {
    setIsOwner(
      currentUserProfile && comment.user_ID === currentUserProfile.uid
    );
  }, [currentUserProfile]);

  return (
    <div className="comment">
      <div
        className="fr-max"
        onClick={() => myHistory.push(`/${comment.user_username}`)}
      >
        <div className="max-fr">
          <img
            className="comment__avatar"
            src={
              comment.user_avatar
                ? comment.user_avatar
                : "../../../imgs/avatar.png"
            }
            alt="comment author"
          />
          <div className="comment__user-name">{comment.user_name}</div>
        </div>
        <div className="comment__time">
          <Moment fromNow>{createdOn}</Moment>
        </div>
      </div>

      {isEdited ? (
        <>
          <div className="tiny-margin-bottom tiny-margin-top">
            <TextArea
              type="text"
              placeHolder="Your comment"
              value={values}
              onChange={(val) => {
                if (val.length < 500 && validateWordsLength(val, 50))
                  setValues(val);
              }}
            />
          </div>

          {isOwner ? (
            <div className="max-max tiny-margin-top">
              <div
                className="button-colored"
                onClick={() => {
                  if (values) {
                    blog
                      ? updateCommentBlog(values, comment.id, () => {
                          setIsEdited(false);
                          setComments((vals) => {
                            return vals.map((com) =>
                              com.id !== comment.id
                                ? com
                                : { ...comment, body: values }
                            );
                          });

                          setLastSavedValues(values);
                        })
                      : updateComment(values, comment.id, () => {
                          setIsEdited(false);
                          setComments((vals) => {
                            return vals.map((com) =>
                              com.id !== comment.id
                                ? com
                                : { ...comment, body: values }
                            );
                          });

                          setLastSavedValues(values);
                        });
                  }
                }}
              >
                Save
              </div>

              <div
                className="button-colored"
                onClick={() => {
                  setValues(comment.body);
                  setIsEdited(false);
                }}
              >
                Cancel
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="room__description tiny-margin-top">
            <div className="comment__body">{values}</div>
          </div>

          {isOwner ? (
            <div className="max-max tiny-margin-top">
              <div
                className="button-colored "
                onClick={() => setIsEdited(true)}
              >
                Edit
              </div>

              <div
                className="button-colored"
                onClick={() => {
                  console.log("comment", comment);

                  if (values) {
                    blog
                      ? deleteCommentBlog(comment.id, () => {
                          setComments((vals) => {
                            return vals.filter((com) => com.id !== comment.id);
                          });
                        })
                      : deleteComment(comment.id, () => {
                          setComments((vals) => {
                            return vals.filter((com) => com.id !== comment.id);
                          });
                        });
                  }
                }}
              >
                Delete
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default connect(null, {
  updateComment,
  deleteComment,
  updateCommentBlog,
  deleteCommentBlog,
})(Comment);
