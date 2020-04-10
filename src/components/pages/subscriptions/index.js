import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";

import {
  fetchFirstSubscriptionsLive,
  fetchMoreSubscriptionsLive,
  fetchFirstSubscriptionsUpcoming,
  fetchMoreSubscriptionsUpcoming,
  fetchFirstSubscriptionsPast,
  fetchMoreSubscriptionsPast,
  togglePopup,
} from "../../../actions";

import { renderSection } from "../../../utils/feeds";

const Subscriptions = ({
  subscriptionsLive,
  subscriptionsUpcoming,
  subscriptionsPast,
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

  const [lastVisiblePast, setLastVisiblePast] = useState(null);
  const [reachedLastPast, setReachedLastPast] = useState(true);

  const dateNow = new Date();

  useEffect(() => {
    if (currentUser)
      fetchFirstSubscriptionsLive(
        setLastVisibleLive,
        setReachedLastLive,
        dateNow,
        currentUser.uid
      );

    fetchFirstSubscriptionsUpcoming(
      setLastVisibleUpcoming,
      setReachedLastUpcoming,
      dateNow,
      currentUser.uid
    );

    fetchFirstSubscriptionsPast(
      setLastVisiblePast,
      setReachedLastPast,
      dateNow,
      currentUser.uid
    );
  }, [currentUser]);

  return (
    <div className="feed">
      {renderSection(
        subscriptionsLive,
        "Live Streams by Artists you Follow",
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
        "Coming Up by Artists you Follow",
        fetchMoreSubscriptionsUpcoming,
        lastVisibleUpcoming,
        setLastVisibleUpcoming,
        reachedLastUpcoming,
        setReachedLastUpcoming,
        dateNow,
        currentUserProfile
      )}

      {renderSection(
        subscriptionsPast,
        "Streams you've missed by Artists you Follow",
        fetchMoreSubscriptionsPast,
        lastVisiblePast,
        setLastVisiblePast,
        reachedLastPast,
        setReachedLastPast,
        dateNow,
        currentUserProfile
      )}

      {!subscriptionsLive.length && !subscriptionsUpcoming.length  && !subscriptionsPast.length ? (
        <div className="empty-feed small-margin-top centered">
          Start following artists to see all their events
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    subscriptionsLive: state.subscriptionsLive,
    subscriptionsUpcoming: state.subscriptionsUpcoming,
    subscriptionsPast: state.subscriptionsPast,
    popupShown: state.popupShown,
  };
};

export default connect(mapStateToProps, {
  fetchFirstSubscriptionsLive,
  fetchMoreSubscriptionsLive,
  fetchFirstSubscriptionsUpcoming,
  fetchMoreSubscriptionsUpcoming,
  fetchFirstSubscriptionsPast,
  fetchMoreSubscriptionsPast,
  togglePopup,
})(Subscriptions);
