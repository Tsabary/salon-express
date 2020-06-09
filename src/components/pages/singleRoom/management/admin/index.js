import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import algoliasearch from "algoliasearch/lite";

import { AuthContext } from "../../../../../providers/Auth";

import history from "../../../../../history";
import { addAdmin, deleteRoom } from "../../../../../actions/rooms";

import { fetchStrangerProfile } from "../../../../../actions/profiles";

import User from "../../../../otherComponents/user/search";
import InputField from "../../../../formComponents/inputField";
import { RoomContext } from "../../../../../providers/Room";

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
);
const index = searchClient.initIndex("users");

const Admin = ({ room, isOwner, addAdmin, deleteRoom }) => {
  const myHistory = useHistory(history);
  const { setGlobalRoom } = useContext(RoomContext);
  const { currentUserProfile } = useContext(AuthContext);
  const [newAdmin, setNewAdmin] = useState("");
  const [userSuggestions, setUserSuggestions] = useState([]);

  useEffect(() => {
    if (!newAdmin.length) return;

    index.search(newAdmin).then(({ hits }) => {
      setUserSuggestions(
        hits.filter((hit) => !room.admins_ID.includes(hit.objectID)).slice(0, 7)
      );
    });
  }, [newAdmin]);

  const handleChoose = (user) => {
    const admin = { ...user, uid: user.objectID };
    delete admin.objectID;
    delete admin._highlightResult;

    addAdmin(room, admin, (ro) => {
      setGlobalRoom(ro);
      setNewAdmin("");
    });

    // setValues((flr) => {
    //   return {
    //     ...flr,
    //     admins: flr.admins ? [...flr.admins, admin] : [admin],
    //     admins_ID: flr.admins_ID
    //       ? [...flr.admins_ID, admin.user_ID]
    //       : [admin.user_ID],
    //   };
    // });
  };

  const renderAdmins = (admins) => {
    return admins.map((admin) => {
      return (
        <div key={admin.uid}>
          <User
            user={{
              avatar: admin.avatar,
              name: admin.name,
              username: admin.username,
              uid: admin.uid,
            }}
            className="extra-tiny-margin-top clickable"
            onClick={() => myHistory.push(`/${admin.username}`)}
          />
        </div>
      );
    });
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

  return (room && room.associate) || isOwner ? (
    <div
      className={
        isOwner ? "management__admin--owner" : "management__admin--visitor"
      }
    >
      <div
        className="section__title"
        onClick={() => {
          console.log("switchhh");
        }}
      >
        Admins
      </div>


      {isOwner ? (
        <div>
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
        </div>
      ) : null}

      {room.admins ? (
        <div className="tiny-margin-top">{renderAdmins(room.admins)} </div>
      ) : null}

    </div>
  ) : null;
};

export default connect(null, {
  fetchStrangerProfile,
  addAdmin,
  deleteRoom,
})(Admin);
