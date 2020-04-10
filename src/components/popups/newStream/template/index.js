import "./styles.scss";
import React from "react";

import { deleteTemplate } from "../../../../actions";
import { connect } from "react-redux";

const Template = ({ template, setTemplate, deleteTemplate }) => {
  return (
    <div className="template">
      <input
        className="template-delete-checkbox"
        type="checkbox"
        id={`template-delete-checkbox` + template.id}
      />
      <span className="template__visible">
        <div className="cover-image__container">
          <img
            className="cover-image__preview clickable"
            src={"https://" + template.image}
          />
        </div>
        <div>
          <div className="template__title">{template.title}</div>
          <div className="template__body">{template.body}</div>
          <div className="max-max-fr">
            <label
              className="template__button--normal"
              htmlFor="add-stream-checkbox"
              onClick={setTemplate}
            >
              Use this
            </label>

            <label
              className="template__button--delete"
              htmlFor={`template-delete-checkbox` + template.id}
            >
              Delete
            </label>

            <div />
          </div>
        </div>
      </span>
      <span className="template__hidden">
        <div>Are you sure you want to delete this template?</div>

        <div className="stream__actions small-margin-top">
          <label
            className="stream-button stream-button__normal"
            htmlFor={`template-delete-checkbox` + template.id}
          >
            Cancel
          </label>

          <label
            className="stream-button stream-button__delete"
            htmlFor={`template-delete-checkbox` + template.id}
            onClick={() => deleteTemplate(template)}
          >
            Delete
          </label>
        </div>
      </span>
    </div>
  );
};

export default connect(null, { deleteTemplate })(Template);
