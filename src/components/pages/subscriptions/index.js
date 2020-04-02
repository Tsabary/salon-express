import "./styles.scss";
import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";
import { breakpointColumnsObj } from "../../../constants";

import {
  fetchFirstSubscriptionsLive,
  fetchMoreSubscriptionsLive,
  fetchFirstSubscriptionsUpcoming,
  fetchMoreSubscriptionsUpcoming,
  togglePopup
} from "../../../actions";
import Stream from "../../stream";

import Masonry from "react-masonry-css";

const Subscriptions = ({
  subscriptionsLive,
  subscriptionsUpcoming,
  fetchFirstSubscriptionsLive,
  fetchMoreSubscriptionsLive,
  fetchFirstSubscriptionsUpcoming,
  fetchMoreSubscriptionsUpcoming
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

  const renderItems = streams => {
    return streams.map(stream => {
      return (
        <Stream
          stream={stream}
          user={currentUserProfile || { uid: "", following: [], followers: [] }}
          key={stream.id}
        />
      );
    });
  };

  return (
    <div className="feed">
      {subscriptionsLive.length ? (
        <>
          <div className="my-streams__header">Coming up</div>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(subscriptionsLive)}
          </Masonry>
          {subscriptionsLive.length && !reachedLastLive ? (
            <div
              className="feed__load-more"
              onClick={() =>
                fetchMoreSubscriptionsLive(
                  lastVisibleLive,
                  setLastVisibleLive,
                  currentUser.uid,
                  setReachedLastLive,
                  dateNow
                )
              }
            >
              Load More
            </div>
          ) : null}
        </>
      ) : null}

      {subscriptionsUpcoming.length ? (
        <>
          <div className="my-streams__header">Coming up</div>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(subscriptionsUpcoming)}
          </Masonry>
          {subscriptionsUpcoming.length && !reachedLastUpcoming ? (
            <div
              className="feed__load-more"
              onClick={() =>
                fetchMoreSubscriptionsUpcoming(
                  lastVisibleUpcoming,
                  setLastVisibleUpcoming,
                  currentUser.uid,
                  setReachedLastUpcoming,
                  dateNow
                )
              }
            >
              Load More
            </div>
          ) : null}
        </>
      ) : null}

      {!subscriptionsLive.length && !subscriptionsUpcoming.length ? (
        <div className="empty-feed small-margin-top centered">
          Start following hosts to see all their events
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    subscriptionsLive: state.subscriptionsLive,
    subscriptionsUpcoming: state.subscriptionsUpcoming,
    popupShown: state.popupShown
  };
};

export default connect(mapStateToProps, {
  fetchFirstSubscriptionsLive,
  fetchMoreSubscriptionsLive,
  fetchFirstSubscriptionsUpcoming,
  fetchMoreSubscriptionsUpcoming,
  togglePopup
})(Subscriptions);
