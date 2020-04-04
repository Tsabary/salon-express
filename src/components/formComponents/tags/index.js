import "./styles.scss";
import React, { useState } from "react";
import { connect } from "react-redux";

import InputField from "../inputField";

const Tags = ({
  tags,
  values,
  setValues,
  errorMessages,
  formError,
  setFormError
}) => {
  const [tagInput, setTagInput] = useState("");
  const [tagsSuggestions, setTagsSuggestions] = useState(null);

  const renderTagsSuggestions = (suggestions, existing) => {
    return suggestions
      .filter(tag => {
        return !existing.includes(Object.keys(tag)[0]);
      })
      .sort((a, b) => {
        const keyA = Object.keys(a)[0];
        const keyB = Object.keys(b)[0];

        return a[keyA] < b[keyB] ? 1 : -1;
      })
      .slice(0, 10)
      .map(tag => {
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

  const filterTags = input => {
    return tags.filter(el => {
      return Object.keys(el)[0].startsWith(input);
    });
  };

  const handleTagInputChange = input => {
    const cleanTag = input.replace(/\P{L}+/gu, "");
    if (cleanTag.length < 25) setTagInput(cleanTag);
    setTagsSuggestions(cleanTag ? filterTags(cleanTag) : null);
  };

  const addTag = newTag => {
    if (!(values && values.tags)) values.tags = [];
    if (values.tags.includes(newTag) || !newTag.length) return;
    if (values.tags.length === 5) {
      setFormError(errorMessages.tagsMax);
      return;
    }
    setValues({
      ...values,
      tags: [...values.tags, newTag]
    });
    setTagInput("");
  };

  const handleKeyPress = event => {
    console.log(event);
    event.stopPropagation();
    if (event.key === "Enter") {
      addTag(
        tagInput
          .trim()
          .toLowerCase()
          .split(" ")
          .join("-")
      );
      return false;
    }
  };

  const removeTag = tag => {
    setValues({ ...values, tags: values.tags.filter(el => el !== tag) });
    if (formError === errorMessages.tagsMax) setFormError("");
  };

  const renderTags = tags => {
    return tags.map(el => {
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
    <div className="tiny-margin-bottom">
      <div className="tags__container">
        <InputField
          type="text"
          placeHolder="Add 2-5 tags (for example 'Party' or 'Yoga')"
          value={tagInput}
          onChange={handleTagInputChange}
          onKeyDown={handleKeyPress}
          // label="Add between 2 to 5 tags"
        />
        <div
          className="tags__submit"
          onClick={() =>
            addTag(
              tagInput
                .toLowerCase()
                .split(" ")
                .join("-")
            )
          }
        >
          &rarr;
        </div>
      </div>

      {tagsSuggestions
        ? renderSuggestionsContainer(
            tagsSuggestions,
            values.tags ? values.tags : []
          )
        : null}

      <div className="tags">
        {values && values.tags ? renderTags(values.tags) : null}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return { tags: state.tags };
};

export default connect(mapStateToProps)(Tags);
