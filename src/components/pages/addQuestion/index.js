import "./styles.scss";
import React, { useState, useContext } from "react";

import { addQuestion } from "../../../actions";

import InputField from "../../formComponents/inputField";
import RichTextEditor from "../../formComponents/richTextEditor";
import { connect } from "react-redux";
import { AuthContext } from "../../../providers/Auth";

const AddQuestion = ({ addQuestion }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const [values, setValues] = useState({});

  const handleSubmit = () => {
    addQuestion(values, currentUserProfile.uid, () => setValues({}));
  };

  return (
    <div className="add-question">
      <form
        onSubmit={() => {
          console.log("nothing");
        }}
        className="small-margin-top"
        autoComplete="off"
      >
        <InputField
          type="text"
          placeHolder="Title"
          value={values.title}
          onChange={(title) => setValues({ ...values, title })}
          required={true}
        />
        <RichTextEditor
          onChange={(v) => setValues({ ...values, body: v })}
          value={values.body}
        />
        <div className="fr-max">
          <div />
          <button
            type="button"
            className="boxed-button small-margin-top"
            onClick={handleSubmit}
          >
            Add Question
          </button>
        </div>
      </form>
    </div>
  );
};

export default connect(null, { addQuestion })(AddQuestion);
