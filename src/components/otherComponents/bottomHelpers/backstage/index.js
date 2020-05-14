import "./styles.scss";
import React, { useContext, useState, useEffect } from "react";
import { connect } from "react-redux";
import ScrollToBottom from "react-scroll-to-bottom";

import { AuthContext } from "../../../../providers/Auth";

import {
  newBackstageMessage,
  resetBackstageNotifications,
  listenToBackstage,
} from "../../../../actions/floors";
import { FloorContext } from "../../../../providers/Floor";
import ChatMessage from "../../chatMessage";

const Backstage = ({
  backstage,
  notifications,
  newBackstageMessage,
  resetBackstageNotifications,
  listenToBackstage,
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { globalFloor } = useContext(FloorContext);

  const [open, setOpen] = useState(false);
  const [notCount, setNotCount] = useState(0);

  const [message, setMessage] = useState("");
  const [inProcess, setInProcess] = useState(false);

  // useEffect(() => {
  //  console.log("backstage", backstage)
  // },[backstage])

  useEffect(() => {
    if (open) resetBackstageNotifications();
  }, [open]);

  useEffect(() => {
    setNotCount(notifications.backstage);
  }, [notifications]);

  useEffect(() => {
    listenToBackstage(globalFloor, () => {
      // notification.play();
    });
  }, [currentUserProfile]);

  const handleSubmit = () => {
    if (!message) return;
    setInProcess(true);
    newBackstageMessage(message, globalFloor, currentUserProfile, () => {
      setMessage("");
      setInProcess(false);
    });
  };

  const renderMessages = (backstage) => {
    return backstage.map((msg) => {
      return <ChatMessage message={msg} key={msg.created_on + msg.user_ID} />;
    });
  };

  return (
    <div className="updates">
      <input
        className="backstage__checkbox"
        type="checkbox"
        id="backstage"
        onChange={() => setOpen(!open)}
        // readOnly
      />
      <label className="max-max updates__top" htmlFor="backstage">
        <div className="updates__title">Backstage</div>
        {notCount ? (
          <div className="updates__notifications">{notCount}</div>
        ) : null}
      </label>
      <div className="backstage__container fr">
        <div className="medium-margin-bottom">
          <ScrollToBottom
            mode="bottom"
            scrollViewClassName="backstage__scroll-inner"
            className="backstage__scroll"
          >
            {backstage && backstage.length && open ? (
              <div style={{ padding: "10px" }}>{renderMessages(backstage)}</div>
            ) : (
              <div style={{ padding: "10px" }}>
                You're the first person backstage. Welcome the rest of the crew!
              </div>
            )}
          </ScrollToBottom>
        </div>
        {/* <div /> */}
        <div className="backstage__send fr-max" id="backstage__send">
          <input
            className="faq__input"
            type="text"
            placeholder="Aa"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {inProcess ? (
            <div className="small-button small-button--disabled">Send</div>
          ) : (
            <div className="small-button" onClick={handleSubmit}>
              Send
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    backstage: state.backstage,
    notifications: state.notifications,
  };
};

export default connect(mapStateToProps, {
  newBackstageMessage,
  resetBackstageNotifications,
  listenToBackstage,
})(Backstage);
