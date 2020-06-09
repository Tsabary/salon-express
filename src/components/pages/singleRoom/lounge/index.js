import "./styles.scss";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../../../providers/Auth";
import { knock, messageHost } from "../../../../actions/rooms";
import { connect } from "react-redux";
import InputField from "../../../formComponents/inputField";
import TextArea from "../../../formComponents/textArea";
import User from "../../../otherComponents/user/static";
import { UniqueIdContext } from "../../../../providers/UniqueId";
import Moment from "react-moment";
import LoungeMessage from "../../../otherComponents/loungeMsg";

const Lounge = ({
  profile,
  isWaiting,
  values,
  setValues,
  reset,
  loungeMessages,
  knock,
  messageHost,
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { uniqueId } = useContext(UniqueIdContext);

  const [msg, setMsg] = useState("");

  const handleKnock = (e) => {
    e.preventDefault();
    if (!values.name) return;

    const finalValues = { ...values };

    if (msg) {
      finalValues.messages = [
        {
          user_ID: currentUserProfile ? currentUserProfile.uid : uniqueId,
          message: msg,
          created_on: new Date(),
        },
      ];
    }

    knock(
      `user-${profile.uid}`,
      currentUserProfile ? currentUserProfile.uid : uniqueId,
      finalValues,
      () => {
        reset();
        setMsg("");
      }
    );
  };

  const handleMessage = (e) => {
    e.preventDefault();
    if (!msg) return;

    messageHost(
      `user-${profile.uid}`,
      currentUserProfile ? currentUserProfile.uid : uniqueId,
      currentUserProfile ? currentUserProfile.uid : uniqueId,
      msg,
      () => setMsg("")
    );
  };

  const renderChatMsgs = (msgs) => {
    return msgs.map((msg) => {
      return (
        <LoungeMessage message={msg} key={msg.created_on.toDate().getTime()} />
      );
    });
  };

  return (
    <div className="lounge single-room__knock">
      {isWaiting ? null : (
        <form
          className="lounge__form section__container"
          onSubmit={(e) => handleKnock(e)}
        >
          {currentUserProfile ? (
            <User user={currentUserProfile} />
          ) : (
            <InputField
              type="text"
              placeHolder="name"
              value={values.name}
              onChange={(name) => setValues({ ...values, name })}
              className="extra-tiny-margin-top"
            />
          )}

          <TextArea
            type="text"
            placeHolder="Anything you'd like to add?"
            value={msg}
            onChange={setMsg}
            className="extra-tiny-margin-top"
          />

          <button type="submit" className="small-button tiny-margin-top">
            Tap to knock
          </button>
        </form>
      )}

      <div
        className={
          isWaiting
            ? "lounge__chat--full section__container"
            : "lounge__chat section__container"
        }
      >
        <div className="section__title">Waiting Room Chat</div>
        <form
          className="fr-max"
          onSubmit={(e) => handleMessage(e)}
          autoComplete="off"
        >
          <InputField
            type="text"
            placeHolder="Use this chat to message the host if they haven't approved you yet."
            value={msg}
            onChange={setMsg}
          />
          {isWaiting ? (
            <button type="submit" className="small-button">
              Send
            </button>
          ) : (
            <div className="small-button small-button--disabled">Send</div>
          )}
        </form>

        <div className="lounge__messages tiny-margin-top">
          {renderChatMsgs(loungeMessages)}
        </div>
      </div>
    </div>
  );
};

export default connect(null, { knock, messageHost })(Lounge);
