import "./styles.scss";
import React, { useState, useContext, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import history from "../../../../history";

import { AuthContext } from "../../../../providers/Auth";
import { errorMessages } from "../../../../utils/forms";

import { newPost } from "../../../../actions/blog";
import { fetchTags } from "../../../../actions/global";

import InputField from "../../../formComponents/inputField";
import RichTextEditor from "../../../formComponents/richTextEditor";
import Tags from "../../../formComponents/tags";

const NewPost = ({ tags, newPost, fetchTags }) => {
  const myHistory = useHistory(history);
  const { currentUserProfile } = useContext(AuthContext);
  const [values, setValues] = useState({});
  const [formError, setFormError] = useState(null);

  const [imageAsFile, setImageAsFile] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!tags.length) fetchTags();
  }, [tags]);

  useEffect(() => {
    if (!currentUserProfile || !currentUserProfile.uid) return;

    setValues({
      user_ID: currentUserProfile.uid,
      user_name: currentUserProfile.name,
      user_username: currentUserProfile.username,
      user_avatar: currentUserProfile.avatar,
      likes: [],
    });
  }, [currentUserProfile]);

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile(() => image);
    setSelectedImage(URL.createObjectURL(image));
  };

  const wordCount = (string) => {
    return string
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const validateForm = () => {
    switch (true) {
      case !values:
        return false;

      case !values.title:
        setFormError("Please give your post a title");
        return false;

      case !values.subtitle:
        setFormError("Please give your post a subtitle");

        return false;

      case !values.body || !wordCount(values.body):
        setFormError("Please add some content to your post");
        return false;

      case !imageAsFile:
        setFormError("Please choose an image to your post");
        return false;

      case imageAsFile.size > 500000:
        setFormError(
          "Your image size is too big. Please choose an image that is smaller than 500kb"
        );
        return false;

      default:
        return true;
    }
  };

  const handleSubmit = () => {
    if (validateForm())
      newPost(values, imageAsFile, (id) => {
        myHistory.push(`/blog/${id}`);
        setFormError(null);
      });
  };
  return (
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
        placeholder="Your two cents go here"
      />

      <InputField
        type="text"
        placeHolder="Youtube tutorial (video ID only)"
        value={!!values && values.video}
        onChange={(video) => setValues({ ...values, video })}
        className="tiny-margin-top"
      />

      <Tags
        tags={tags}
        values={values}
        setValues={setValues}
        field="tags"
        errorMessages={errorMessages}
        formError={formError}
        setFormError={setFormError}
        className="tiny-margin-top"
        placeHolder="Tag your article with 2-5 relevant tags"
      />

      {formError ? (
        <div className="fr-max small-margin-top form-error">
          <div />
          <div>{formError}</div>
        </div>
      ) : null}
      <div className="fr-max small-margin-top">
        <div />
        <div className="small-button" onClick={handleSubmit}>
          Publish
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    tags: state.tags,
  };
};

export default connect(mapStateToProps, { newPost, fetchTags })(NewPost);
