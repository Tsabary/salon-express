import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";

import {
  fetchFirstSubscriptionsLive,
  fetchMoreSubscriptionsLive,
  fetchFirstSubscriptionsUpcoming,
  fetchMoreSubscriptionsUpcoming,
  togglePopup,
} from "../../../actions";

import { renderSection } from "../../../utils/feeds";

const Subscriptions = ({
  subscriptionsLive,
  subscriptionsUpcoming,
  fetchFirstSubscriptionsLive,
  fetchMoreSubscriptionsLive,
  fetchFirstSubscriptionsUpcoming,
  fetchMoreSubscriptionsUpcoming,
}) => {
  const { currentUser, currentUserProfile } = useContext(AuthContext);
  const [lastVisibleLive, setLastVisibleLive] = useState(null);
  const [reachedLastLive, setReachedLastLive] = useState(true);
  const [lastVisibleUpcoming, setLastVisibleUpcoming] = useState(null);
  const [reachedLastUpcoming, setReachedLastUpcoming] = useState(true);

  const dateNow = new Date();

  useEffect(() => {
    if (currentUser)
      fetchFirstSubscriptionsLive(
        setLastVisibleLive,
        currentUser.uid,
        setReachedLastLive,
        dateNow
      );

    fetchFirstSubscriptionsUpcoming(
      setLastVisibleUpcoming,
      currentUser.uid,
      setReachedLastUpcoming,
      dateNow
    );
  }, [currentUser]);

  return (
    <div className="feed">
      {renderSection(
        subscriptionsLive,
        "Live Streams by Mentors",
        fetchMoreSubscriptionsLive,
        lastVisibleLive,
        setLastVisibleLive,
        reachedLastLive,
        setReachedLastLive,
        dateNow,
        currentUserProfile
      )}

      {renderSection(
        subscriptionsUpcoming,
        "Coming Up by Mentors",
        fetchMoreSubscriptionsUpcoming,
        lastVisibleUpcoming,
        setLastVisibleUpcoming,
        reachedLastUpcoming,
        setReachedLastUpcoming,
        dateNow,
        currentUserProfile
      )}

      {!subscriptionsLive.length && !subscriptionsUpcoming.length ? (
        <div className="empty-feed small-margin-top centered">
          Start following hosts to see all their events
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    subscriptionsLive: state.subscriptionsLive,
    subscriptionsUpcoming: state.subscriptionsUpcoming,
    popupShown: state.popupShown,
  };
};

export default connect(mapStateToProps, {
  fetchFirstSubscriptionsLive,
  fetchMoreSubscriptionsLive,
  fetchFirstSubscriptionsUpcoming,
  fetchMoreSubscriptionsUpcoming,
  togglePopup,
})(Subscriptions);
