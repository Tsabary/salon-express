import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { Howl, Howler } from "howler";

import updateSound from "../../../../files/update.mp3";

import { AuthContext } from "../../../../providers/Auth";
import { connect } from "react-redux";
import ScrollToBottom from "react-scroll-to-bottom";

import { listenToUpdates, resetNotifications } from "../../../../actions/global";

import Update from "./update";

const Updates = ({
  listenToUpdates,
  resetNotifications,
  updates,
  notifications,
}) => {
  const notification = new Howl({
    src: [updateSound],
  });

  const { currentUserProfile } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [notCount, setNotCount] = useState(0);

  useEffect(() => {
    open ? resetNotifications() : setNotCount(notifications);
  }, [notifications, open]);

  useEffect(() => {
    if (!currentUserProfile) return;
    listenToUpdates(currentUserProfile, () => {
      console.log("new update")
      // notification.play();
    });
  }, [currentUserProfile]);

  const renderUpdates = (updates) => {
    return updates.map((update) => {
      return (
        <Update update={update} key={update.created_on + update.room_ID} />
      );
    });
  };

  return (
    <div className="updates">
      <input
        className="updates__checkbox"
        type="checkbox"
        id="updates"
        onChange={() => setOpen(!open)}
        // readOnly
      />
      <label className="max-max updates__top" htmlFor="updates">
        <div className="updates__title">Live Updates</div>
        {notifications ? (
          <div className="updates__notifications">{notCount}</div>
        ) : null}
      </label>

      {/* <div className="updates__container"> */}
      <ScrollToBottom
        mode="bottom"
        scrollViewClassName="updates__scoll"
        className="updates__container"
      >
        {updates && updates.length ? (
          <div style={{ padding: "10px" }}>{renderUpdates(updates)}</div>
        ) : (
          <div style={{ padding: "10px" }}>
            Add some Rooms to your favorites to begin receiving updates
          </div>
        )}
        {/* {updates && updates.length ? renderUpdates(updates) : null} */}
      </ScrollToBottom>
    </div>
    // </div>
  );
};

const mapStateToProps = (state) => {
  return {
    updates: state.updates,
    notifications: state.notifications,
  };
};

export default connect(mapStateToProps, {
  listenToUpdates,
  resetNotifications,
})(Updates);
