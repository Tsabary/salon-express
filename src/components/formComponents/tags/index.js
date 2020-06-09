import "./styles.scss";
import React, { useState } from "react";
// import { connect } from "react-redux";

import InputField from "../inputField";

const Tags = ({
  tags,
  values,
  setValues,
  field,
  errorMessages,
  formError,
  setFormError,
  placeHolder,
  className
}) => {
  const [tagInput, setTagInput] = useState("");
  const [tagsSuggestions, setTagsSuggestions] = useState(null);

  const renderTagsSuggestions = (suggestions, existing) => {
    return suggestions
      .filter((tag) => {
        return !existing.includes(Object.keys(tag)[0]);
      })
      .sort((a, b) => {
        const keyA = Object.keys(a)[0];
        const keyB = Object.keys(b)[0];

        return a[keyA] < b[keyB] ? 1 : -1;
      })
      .slice(0, 10)
      .map((tag) => {
        const key = Object.keys(tag)[0];
        return (
          <div
            className="tag tag-suggestion"
            onClick={() => addTag(key)}
            key={key}
          >
            {key}
            {"  "}
            <span className="tag-suggestion__count">{tag[key]}</span>
          </div>
        );
      });
  };

  const renderSuggestionsContainer = (suggestions, existing) => {
    return (
      <div className="tags">{renderTagsSuggestions(suggestions, existing)}</div>
    );
  };

  const filterTags = (input) => {
    return tags.filter((el) => {
      return Object.keys(el)[0].startsWith(input);
    });
  };

  const handleTagInputChange = (input) => {
    const cleanTag = input
      // .replace(/^([^-]*-)|-/g, "$1")
      // .replace(/[^\p{L}\s\d-]+/gu, "")
      .replace(/^-+|(-){2,}/g, "$1")
      .replace(/[^\p{L}\s-]+/gu, "")
      .toLowerCase()
      .split(" ")
      .join("-");
    if (cleanTag.length < 30) setTagInput(cleanTag);
    setTagsSuggestions(cleanTag ? filterTags(cleanTag) : null);
  };

  const handleKeyPress = (event) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      addTag(tagInput.trim().toLowerCase().split(" ").join("-"));
      return false;
    }
  };

  const addTag = (newTag) => {
    if (!(values && values[field])) values[field] = [];
    if (values[field].includes(newTag) || !newTag.length) return;
    if (values[field].length === 5) {
      setFormError(errorMessages.tagsMax);
      return;
    }
    setValues({
      ...values,
      [field]: [...values[field], newTag],
    });
    setTagInput("");
  };

  const removeTag = (tag) => {
    setValues({ ...values, [field]: values[field].filter((el) => el !== tag) });
    if (formError === errorMessages.tagsMax) setFormError("");
  };

  const renderTags = (tags) => {
    return tags.map((el) => {
      return (
        <div
          className="tag tag-selected"
          onClick={() => removeTag(el)}
          key={el}
        >
          {el}
        </div>
      );
    });
  };

  return (
    <div className={className ? `tiny-margin-bottom ${className}` : "tiny-margin-bottom"}>
      <div className="tags__container">
        <InputField
          type="text"
          placeHolder={placeHolder}
          value={tagInput}
          onChange={handleTagInputChange}
          onKeyDown={handleKeyPress}
          // label="Add between 2 to 5 tags"
        />
        <div
          className="tags__submit"
          onClick={() =>
            addTag(tagInput.trim().toLowerCase().split(" ").join("-"))
          }
        >
          &rarr;
        </div>
      </div>

      {tagsSuggestions
        ? renderSuggestionsContainer(
            tagsSuggestions,
            values[field] ? values[field] : []
          )
        : null}

      <div className="tags tiny-margin-top">
        {values && values[field] ? renderTags(values[field]) : null}
      </div>
    </div>
  );
};


export default Tags;
