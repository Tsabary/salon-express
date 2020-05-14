import "./styles.scss";
import React from "react";
import Moment from "react-moment";

const ChatMessage = ({ message }) => {
  return (
    <div className="chat-message">
      <img
        className="chat-message__avatar"
        src={
          message.user_avatar ? message.user_avatar : "../../../imgs/avatar.png"
        }
        alt="author"
      />
      <div className="">
        <div className="fr-max">
          <div />
          <Moment className="chat-message__timestamp" fromNow>
            {message.created_on}
          </Moment>
        </div>
        <div className="chat-message__body">{message.body}</div>

        <div className="chat-message__user-name">{`${message.user_name} ${
          message.user_username === message.user_ID
            ? ""
            : `(${message.user_username})`
        }`}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
