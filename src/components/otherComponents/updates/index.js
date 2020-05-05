import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import UIfx from "uifx";
// import { Howl, Howler } from "howler";

import updateSound from "../../../files/update.mp3";

import { AuthContext } from "../../../providers/Auth";
import { connect } from "react-redux";
import ScrollToBottom from "react-scroll-to-bottom";

import { listenToUpdates, resetNotifications } from "../../../actions";

import Update from "./update";

const Updates = ({
  listenToUpdates,
  resetNotifications,
  updates,
  notifications,
}) => {
  // var sound = new Howl({
  //   src: ["update.mp3"],
  // });

  // sound.play();

  const notification = new UIfx(updateSound);

  const { currentUserProfile } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [notCount, setNotCount] = useState(0);

  useEffect(() => {
    open ? resetNotifications() : setNotCount(notifications);
  }, [notifications, open]);

  useEffect(() => {
    if (!currentUserProfile) return;
    listenToUpdates(currentUserProfile, () => notification.play());
  }, [currentUserProfile]);

  const renderUpdates = (updates) => {
    return updates.reverse().map((update) => {
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
      {/* {updates && updates.length ? (
          renderUpdates(updates)
        ) : (
          <div>Add some Rooms to your favorites to begin receiving updates</div>
        )} */}
      <div className="updates__container">
        <ScrollToBottom scrollViewClassName="updates__scroll">
          {updates && updates.length ? (
            renderUpdates(updates)
          ) : (
            <div>
              Add some Rooms to your favorites to begin receiving updates
            </div>
          )}
        </ScrollToBottom>
      </div>
    </div>
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
