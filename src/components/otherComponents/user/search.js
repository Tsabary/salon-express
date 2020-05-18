import "./styles.scss";
import React from "react";

const User = ({ user, onClick, className }) => {
  return (
    <div
      className={className ? `user max-fr ${className}` : "user max-fr"}
      onClick={onClick}
    >
      <div className="user__avatar-container">
        <img
          className="user__avatar"
          src={user.avatar ? user.avatar : "../../../imgs/avatar.png"}
          alt="user"
        />
      </div>
      <div className="user__name">
        {`${user.name} ${user.username === user.uid ? "" : `(${user.username})`}`}
      </div>
    </div>
  );
};

export default User;
