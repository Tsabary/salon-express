import "./styles.scss";
import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";
import { breakpointColumnsObj } from "../../../constants";

import {
  fetchFirstSubscriptionStreams,
  fetchMoreSubscriptionStreams,
  togglePopup
} from "../../../actions";
import Stream from "../feed/stream";

import Masonry from "react-masonry-css";

const Subscriptions = ({
  subscriptions,
  fetchFirstSubscriptionStreams,
  fetchMoreSubscriptionStreams,
  togglePopup,
  popupShown
}) => {
  const { currentUser, currentUserProfile } = useContext(AuthContext);
  const [lastVisible, setLastVisible] = useState(null);
  const [reachedLast, setReachedLast] = useState(true);
  const timestampNow = Date.now();

  useEffect(() => {
    console.log("subscriptions", subscriptions);
  }, [subscriptions]);

  useEffect(() => {
    if (currentUser)
      fetchFirstSubscriptionStreams(
        setLastVisible,
        currentUser.uid,
        setReachedLast,
        timestampNow
      );
  }, [currentUser]);

  const loadMore = () => {
    fetchMoreSubscriptionStreams(
      lastVisible,
      setLastVisible,
      currentUser.uid,
      setReachedLast,
      timestampNow
    );
  };

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
      <a
        style={{ display: popupShown ? "none" : "" }}
        onClick={togglePopup}
        className="post-button"
        href={
          currentUser && currentUser.emailVerified ? "#new-stream" : "#sign-up"
        }
      >
        +
      </a>
      {!!subscriptions.length ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {renderItems(subscriptions)}
        </Masonry>
      ) : null}

      {subscriptions.length && !reachedLast ? (
        <div className="feed__load-more" onClick={loadMore}>
          Load More
        </div>
      ) : null}

      {!subscriptions.length ? (
        <div className="empty-feed small-margin-top centered">
          Start following hosts to see all their events
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    subscriptions: state.subscriptions,
    popupShown: state.popupShown
  };
};

export default connect(mapStateToProps, {
  fetchFirstSubscriptionStreams,
  fetchMoreSubscriptionStreams,
  togglePopup
})(Subscriptions);
