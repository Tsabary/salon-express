import "./styles.scss";
import React, { useState } from "react";
import UserActive from "../../user/static";
import UserUnactive from "../../user/search";

import {
  approveVisitor,
  denyVisitor,
  messageHost,
} from "../../../../actions/rooms";
import { connect } from "react-redux";
import { useContext } from "react";
import { AuthContext } from "../../../../providers/Auth";
import LoungeMessage from "../../loungeMsg";
import InputField from "../../../formComponents/inputField";

const SingleRequest = ({
  request,
  approveVisitor,
  denyVisitor,
  messageHost,
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const [msg, setMsg] = useState("");

  const renderChatMsgs = (msgs) => {
    if (!msgs) return;
    return msgs.map((msg) => {
      return (
        <LoungeMessage message={msg} key={msg.created_on.toDate().getTime()} />
      );
    });
  };

  const handleMessage = (e) => {
    e.preventDefault();
    if (!msg) return;

    messageHost(
      `user-${currentUserProfile.uid}`,
      request.user_ID,
      currentUserProfile.uid,
      msg,
      () => setMsg("")
    );
  };

  return (
    <div className="single-request">
      <div className="section__title">Room visitor</div>
      {request.username ? (
        <UserActive user={request} />
      ) : (
        <div className="max-max">
          <UserUnactive user={request} />
          (unregistered)
        </div>
      )}

      {request.note ? (
        <div className="single-request__note">
          {request.name} says: {request.note}
        </div>
      ) : null}

      <div className="flex-group-spaced tiny-margin-top">
        <div
          className="text-button-normal"
          onClick={() => {
            approveVisitor(`user-${currentUserProfile.uid}`, request.id);
          }}
        >
          Accept
        </div>
        <div
          className="text-button-normal"
          onClick={() => {
            denyVisitor(`user-${currentUserProfile.uid}`, request.id);
          }}
        >
          Deny
        </div>
      </div>
      <div className="lounge__messages tiny-margin-top">
        {renderChatMsgs(request.messages)}
      </div>
      <form
        className="fr-max tiny-margin-top"
        onSubmit={(e) => handleMessage(e)}
        autoComplete="off"
      >
        <InputField
          type="text"
          placeHolder="Use this chat to message the host if they haven't approved you yet."
          value={msg}
          onChange={setMsg}
        />
        <button type="submit" className="small-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default connect(null, { approveVisitor, denyVisitor, messageHost })(
  SingleRequest
);
