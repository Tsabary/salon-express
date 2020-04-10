import "./styles.scss";
import React, { useState, useContext, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import history from "../../../history";

import { fetchTags } from "../../../actions";
import { SearchContext } from "../../../providers/Search";
import { PageContext } from "../../../providers/Page";

const FilterInput = ({ tags, fetchTags }) => {
  const myHistory = useHistory(history);

  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const { setPage } = useContext(PageContext);

  const [tagsSuggestions, setTagsSuggestions] = useState(null);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (searchTerm) handleChange(`/on/${searchTerm}`, 5);
  }, [searchTerm]);

  useEffect(() => {
    if (!tags.length) fetchTags();
  }, []);

  const handleChange = (path, page) => {
    setPage(page);
    myHistory.push(path);
  };

  const filterTags = (input) => {
    return tags.filter((el) => {
      return Object.keys(el)[0].startsWith(input);
    });
  };

  const handleTagInputChange = (input) => {
    setTagInput(input);
    if (!!tags.length) setTagsSuggestions(input ? filterTags(input) : null);
  };

  const addTag = (tag) => {
    setPage(5);
    setSearchTerm(tag);
    setTagInput("");
  };

  const renderTagsSuggestions = (suggestions) => {
    return suggestions
      .sort((a, b) => {
        const keyA = Object.keys(a)[0];
        const keyB = Object.keys(b)[0];

        return a[keyA] < b[keyB] ? 1 : -1;
      })
      .slice(0, 5)
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

  const handleKeyPress = (event) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      addTag(tagInput.toLowerCase().split(" ").join("-"));
      return false;
    }
  };

  const clearTag = () => {
    setSearchTerm(null);
    handleChange(`/`, 1)
  };

  return (
    <div className="filter-input">
      <div className="filter-input__input-container">
        {searchTerm ? (
          <div className="filter-input__tag" onClick={clearTag}>
            {searchTerm}
          </div>
        ) : (
          <input
            className="filter-input__input"
            type="text"
            placeholder="Filter streams by tag"
            autoComplete="new-password"
            value={tagInput}
            onChange={(e) =>
              handleTagInputChange(
                e.target.value.toLowerCase().split(" ").join("-")
              )
            }
            onKeyDown={handleKeyPress}
          />
        )}
      </div>
      {!searchTerm && tagInput ? (
        <div className="tags small-margin-top">
          {tagsSuggestions ? renderTagsSuggestions(tagsSuggestions) : null}
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    tags: state.tags,
  };
};

export default connect(mapStateToProps, { fetchTags })(FilterInput);
