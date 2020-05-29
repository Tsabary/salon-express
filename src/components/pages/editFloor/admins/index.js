import "./styles.scss";
import React, { useEffect, useState } from "react";

import algoliasearch from "algoliasearch/lite";

import InputField from "../../../formComponents/inputField";
import User from "../../../otherComponents/user/search";

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
);
const index = searchClient.initIndex("users");

const Admins = ({ values, setValues }) => {
  const [newAdmin, setNewAdmin] = useState("");
  const [userSuggestions, setUserSuggestions] = useState([]);

  useEffect(() => {
    if (!newAdmin.length) return;

    index.search(newAdmin).then(({ hits }) => {
      setUserSuggestions(
        hits
          .filter((hit) => !values.admins_ID.includes(hit.objectID))
          .slice(0, 7)
      );
    });
  }, [newAdmin]);

  const handleChoose = (user) => {
    const admin = { ...user, uid: user.objectID };
    delete admin.objectID;
    delete admin._highlightResult;

    setValues((flr) => {
      return {
        ...flr,
        admins: flr.admins ? [...flr.admins, admin] : [admin],
        admins_ID: flr.admins_ID
          ? [...flr.admins_ID, admin.user_ID]
          : [admin.user_ID],
        crew: flr.crew ? [...flr.crew, admin] : [admin],
        crew_ID: flr.crew_ID
          ? [...flr.crew_ID, admin.user_ID]
          : [admin.user_ID],
      };
    });
    setNewAdmin("");
  };

  const renderUsers = (users, className, onClick) => {
    return users.map((user) => {
      return (
        <User
          className={className}
          user={{ ...user, uid: user.objectID || user.user_ID }}
          onClick={() => {
            if (onClick) onClick(user);
          }}
        />
      );
    });
  };

  return (
    <div className="floor-admins edit-floor__section  tiny-margin-top">
      <div
        className="edit-floor__section-title"
        onClick={() => console.log("vaaaaaa", values.admins)}
      >
        Admins
      </div>

      <InputField
        type="text"
        placeHolder="Add an admin"
        value={newAdmin}
        onChange={setNewAdmin}
      />
      {newAdmin && userSuggestions.length ? (
        <div className="floor-admins__suggestions-container">
          <div className="floor-admins__suggestions">
            {renderUsers(
              userSuggestions,
              "extra-tiny-margin-top clickable",
              (user) => handleChoose(user)
            )}
          </div>
        </div>
      ) : null}
      {values && values.admins ? (
        <div className="edit-floor__admins">
          {renderUsers(values.admins, "extra-tiny-margin-top")}
        </div>
      ) : null}
    </div>
  );
};

export default Admins;
