import "./styles.scss";
import React, { useState, useContext, useEffect } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../../providers/Auth";

import RichTextEditor from "../../../formComponents/richTextEditor";

import { savePost, fetchCurrentPost } from "../../../../actions/blog";
import { useHistory } from "react-router-dom";
import history from "../../../../history";
import InputField from "../../../formComponents/inputField";

const EditPost = ({ match, blogPosts, savePost, fetchCurrentPost }) => {
  const myHistory = useHistory(history);

  const { currentUserProfile } = useContext(AuthContext);
  const [values, setValues] = useState(null);

  const [imageAsFile, setImageAsFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const thisPost = blogPosts.filter((p) => p.id === match.params.id)[0];
    if (thisPost) {
      setValues(thisPost);
    } else {
      fetchCurrentPost(match.params.id, (p) => setValues(p));
    }
  }, [blogPosts]);

  useEffect(() => {
    if (!currentUserProfile || !currentUserProfile.uid) return;

    setValues({
      ...values,
      user_ID: currentUserProfile.uid,
      user_name: currentUserProfile.name,
      user_username: currentUserProfile.username,
      user_avatar: currentUserProfile.avatar,
    });
  }, [currentUserProfile]);

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile(() => image);
    setSelectedImage(URL.createObjectURL(image));
  };

  return values && values.body ? (
    <div className="new-post">
      <div className="fr-max">
        <div>
          <textarea
            className="input-field__input input-field__input--big"
            type="text"
            placeholder="Give your post a title"
            value={values.title}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
          />
          <textarea
            className="input-field__input input-field__input--medium tiny-margin-top"
            type="text"
            placeholder="Give your post a subtitle"
            value={values.subtitle}
            onChange={(e) => setValues({ ...values, subtitle: e.target.value })}
          />
        </div>
        <span>
          <label
            htmlFor="new-blog-post-image"
            className="new-post__image-container"
          >
            <img
              className="new-post__image-preview clickable"
              src={
                selectedImage ||
                (values && values.image) ||
                "../../imgs/placeholder.jpg"
              }
              alt="cover"
            />
          </label>
          <input
            id="new-blog-post-image"
            className="update-profile__upload"
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageAsFile}
          />
        </span>
      </div>

      <RichTextEditor
        onChange={(body) => {
          setValues({ ...values, body });
        }}
        value={values.body}
        placeholder="Your two cents go here"
      />

      <InputField
        type="text"
        placeHolder="Youtube tutorial (video ID only)"
        value={!!values && values.video}
        onChange={(video) => setValues({ ...values, video })}
        className="tiny-margin-top"
      />

      <div className="fr-max small-margin-top">
        <div />
        <div
          className="small-button"
          onClick={() => {
            if (!values) return;
            if (!values.title || !values.subtitle || !values.body) return;
            savePost(values, imageAsFile, () => {
              myHistory.push(`/blog/${values.id}`);
            });
          }}
        >
          Publish Changes
        </div>
      </div>
    </div>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    blogPosts: state.blogPosts,
  };
};

export default connect(mapStateToProps, { savePost, fetchCurrentPost })(
  EditPost
);
