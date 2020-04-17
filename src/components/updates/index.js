import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import UIfx from "uifx";
import updateSound from "../../files/update.mp3";

import { AuthContext } from "../../providers/Auth";
import { connect } from "react-redux";
import ScrollToBottom from 'react-scroll-to-bottom';

import { listenToUpdates, resetNotifications } from "../../actions";

import Update from "./update";

const Updates = ({
  listenToUpdates,
  resetNotifications,
  updates,
  notifications,
}) => {
  const notification = new UIfx(updateSound);

  const { currentUserProfile } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [notCount, setNotCount] = useState(0);

  useEffect(() => {
    open ? resetNotifications() : setNotCount(notifications);
  }, [notifications, open]);

  useEffect(() => {
    if (currentUserProfile)
      listenToUpdates(currentUserProfile, () => notification.play());
  }, [currentUserProfile]);

  const renderUpdates = (updates) => {
    return updates.map((update) => {
      return (
        <Update update={update} key={update.created_on + update.user_ID} />
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
      />
      <label className="max-max updates__top" htmlFor="updates">
        <div className="updates__title">Live Updates</div>
        {notifications ? (
          <div className="updates__notifications">{notCount}</div>
        ) : null}
      </label>

      <ScrollToBottom scrollViewClassName="updates__container" className="updates__container">
        {updates ? (
          renderUpdates(updates)
        ) : (
          <div>Add some Rooms to your favorites to begin receiving updates</div>
        )}
      </ScrollToBottom>
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
