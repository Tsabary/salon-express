import React, { useState, useContext } from "react";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";

import { AuthContext } from "../../../providers/Auth";

import { addSuggestion } from "../../../actions/global";
import InputField from "../../formComponents/inputField";
import TextArea from "../../formComponents/textArea";

const AddSuggestion = ({ addSuggestion }) => {
  const { addToast } = useToasts();
  const { currentUserProfile } = useContext(AuthContext);

  const [values, setValues] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageAsFile, setImageAsFile] = useState("");

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile(() => image);
    setSelectedImage(URL.createObjectURL(image));
  };

  const handleSubmit = () => {
    addSuggestion(values, imageAsFile, () => {
      addToast("Suggestion added", {
        appearance: "success",
        autoDismiss: true,
      });
    });
  };

  return (
    <div className="add-suggestion" style={{ padding: "2rem" }}>
      <span>
        <label
          htmlFor="add-suggestion-image"
          className="update-profile__image-container"
        >
          <img
            className="update-profile__image-preview clickable"
            src={selectedImage || "../../imgs/placeholder.jpg"}
            alt="Profile"
          />
        </label>
        <input
          id="add-suggestion-image"
          className="update-profile__upload"
          type="file"
          onChange={handleImageAsFile}
        />
      </span>

      <InputField
        type="test"
        placeHolder="Title"
        value={values.title}
        onChange={(title) => setValues({ ...values, title })}
        className="tiny-margin-top"
      />

      <TextArea
        type="test"
        placeHolder="Description"
        value={values.description}
        onChange={(description) => setValues({ ...values, description })}
        className="tiny-margin-top"
      />

      <InputField
        type="test"
        placeHolder="Url"
        value={values.url}
        onChange={(url) => setValues({ ...values, url })}
        className="tiny-margin-top"
      />

      <div
        className="small-button tiny-margin-top"
        onClick={handleSubmit}
      >
        Add suggestion
      </div>
    </div>
  );
};

export default connect(null, { addSuggestion })(AddSuggestion);
