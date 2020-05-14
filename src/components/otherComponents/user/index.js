import "./styles.scss";
import React from "react";

const User = ({ user, userID, onClick, className }) => {
  return (
    <div
      className={className ? `user max-max ${className}` : "user max-max"}
      onClick={onClick}
      key={userID}
    >
      <div className="user__avatar-container">
        <img
          className="user__avatar"
          src={user.avatar ? user.avatar : "../../../imgs/avatar.png"}
          alt="user"
        />
      </div>
      {`${user.name} ${user.username === userID ? "" : `(${user.username})`}`}
    </div>
  );
};

export default User;
