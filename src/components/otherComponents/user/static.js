import "./styles.scss";
import React from "react";

const User = ({ user, className }) => {
  return (
    <a
      className={className ? `user max-fr ${className}` : "user max-fr"}
      href={"https://salon.express/" + user.username}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="user__avatar-container">
        <img
          className="user__avatar"
          src={user.avatar ? user.avatar : "../../../imgs/avatar.png"}
          alt="user"
        />
      </div>
      <div className="user__name">
        {`${user.name} ${
          user.username === user.uid ? "" : `(${user.username})`
        }`}
      </div>
    </a>
  );
};

export default User;
