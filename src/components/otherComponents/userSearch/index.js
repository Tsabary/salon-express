import "./styles.scss";
import React, { useState, useEffect } from "react";
import algoliasearch from "algoliasearch/lite";

import InputField from "../../formComponents/inputField";
import User from "../user/search";

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
);
const index = searchClient.initIndex("users");

const UserSearch = ({
  existingUsers,
  placeholder,
  handleChoose,
  className,
}) => {
  const [userSearch, setUserSearch] = useState("");
  const [userSuggestions, setUserSuggestions] = useState([]);

  useEffect(() => {
    if (!userSearch.length) return;

    index.search(userSearch).then(({ hits }) => {
      setUserSuggestions(
        hits.filter((hit) => !existingUsers.includes(hit.objectID)).slice(0, 7)
      );
    });
  }, [userSearch]);

  const handleClick = (user) => {
    const chosen = { ...user, uid: user.objectID };
    delete chosen.objectID;
    delete chosen._highlightResult;

    handleChoose(chosen);
  };

  const renderUsers = (users, className) => {
    return users.map((user) => {
      return (
        <div key={user.objectID}>
          <User
            className={className}
            user={{ ...user, uid: user.objectID || user.user_ID }}
            onClick={() => {
              handleClick(user);
              setUserSearch("");
            }}
          />
        </div>
      );
    });
  };

  return (
    <div className={className ? `user-search ${className}` : "user-search"}>
      <InputField
        type="text"
        placeHolder={placeholder}
        value={userSearch}
        onChange={setUserSearch}
      />
      {userSearch && userSuggestions.length ? (
        <div className="user-search__suggestions-container">
          <div className="user-search__suggestions">
            {renderUsers(userSuggestions, "extra-tiny-margin-top clickable")}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserSearch;
