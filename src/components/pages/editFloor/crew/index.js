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

const Crew = ({ values, setValues }) => {
  const [newCrewMember, setNewCrewMember] = useState("");
  const [userSuggestions, setUserSuggestions] = useState([]);

  useEffect(() => {
    if (!newCrewMember.length) return;

    index.search(newCrewMember).then(({ hits }) => {
      setUserSuggestions(
        hits.filter((hit) => !values.crew_ID.includes(hit.objectID)).slice(0, 7)
      );
    });
  }, [newCrewMember]);

  const handleChoose = (user) => {
    const crewMember = { ...user, user_ID: user.objectID };
    delete crewMember.objectID;
    delete crewMember._highlightResult;

    setValues((flr) => {
      return {
        ...flr,
        crew: flr.crew ? [...flr.crew, crewMember] : [crewMember],
        crew_ID: flr.crew_ID
          ? [...flr.crew_ID, crewMember.user_ID]
          : [crewMember.user_ID],
      };
    });
    setNewCrewMember("");
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
    <div className="floor-admins edit-floor__section tiny-margin-top">
      <div
        className="edit-floor__section-title"
        onClick={() => console.log("vaaaaaa", values.admins)}
      >
        Crew Members
      </div>

      <InputField
        type="text"
        placeHolder="Add an admin"
        value={newCrewMember}
        onChange={setNewCrewMember}
      />
      {newCrewMember && userSuggestions.length ? (
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
      {values && values.crew ? (
        <div className="edit-floor__admins fr-fr-fr tiny-margin-top">
          {renderUsers(values.crew, "extra-tiny-margin-top")}
        </div>
      ) : null}
    </div>
  );
};

export default Crew;
