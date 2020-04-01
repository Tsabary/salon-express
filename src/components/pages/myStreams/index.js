import "./styles.scss";
import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";
import { AuthContext } from "../../../providers/Auth";

import {
  fetchFirstMyStreamsUpcoming,
  fetchMoreMyStreamsUpcoming,
  fetchFirstMyStreamsPast,
  fetchMoreMyStreamsPast
} from "../../../actions";
import { breakpointColumnsObj } from "../../../constants";
import Stream from "../feed/stream";
import Masonry from "react-masonry-css";
import { Redirect } from "react-router-dom";

const MyStreams = ({
  myStreamsUpcoming,
  myStreamsPast,
  fetchFirstMyStreamsUpcoming,
  fetchMoreMyStreamsUpcoming,
  fetchFirstMyStreamsPast,
  fetchMoreMyStreamsPast
}) => {
  const { currentUser, currentUserProfile } = useContext(AuthContext);

  const [lastVisibleUpcoming, setLastVisibleUpcoming] = useState(null);
  const [lastVisiblePast, setLastVisiblePast] = useState(null);
  const [reachedLastUpcoming, setReachedLastUpcoming] = useState(true);
  const [reachedLastPast, setReachedLastPast] = useState(true);

  useEffect(() => {
    if (currentUser && !myStreamsUpcoming.length) {
      fetchFirstMyStreamsUpcoming(
        currentUser.uid,
        setLastVisibleUpcoming,
        setReachedLastUpcoming
      );
      fetchFirstMyStreamsPast(
        currentUser.uid,
        setLastVisiblePast,
        setReachedLastPast
      );
    }
  }, [currentUser]);

  const renderItems = streams => {
    return streams.map(stream => {
      return (
        <Stream stream={stream} user={currentUserProfile} key={stream.id} />
      );
    });
  };

  return currentUser ? (
    <div className="my-streams">
      {myStreamsUpcoming.length && currentUserProfile ? (
        <>
          <div className="my-streams__header">Coming Up</div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(myStreamsUpcoming)}
          </Masonry>

          {myStreamsUpcoming.length && !reachedLastUpcoming ? (
            <div
              className="feed__load-more small-margin-top"
              onClick={() =>
                fetchMoreMyStreamsUpcoming(
                  currentUser.uid,
                  lastVisibleUpcoming,
                  setLastVisibleUpcoming,
                  setReachedLastUpcoming
                )
              }
            >
              Load More
            </div>
          ) : null}
        </>
      ) : null}

      {myStreamsPast.length && currentUserProfile ? (
        <>
          <div className="my-streams__header">Past</div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(myStreamsPast)}
          </Masonry>

          {myStreamsPast.length && !reachedLastPast ? (
            <div
              className="feed__load-more small-margin-top"
              onClick={() =>
                fetchMoreMyStreamsPast(
                  currentUser.uid,
                  lastVisiblePast,
                  setLastVisiblePast,
                  setReachedLastPast
                )
              }
            >
              Load More
            </div>
          ) : null}
        </>
      ) : null}

      {!myStreamsPast.length && !myStreamsUpcoming.length ? (
        <div className="empty-feed small-margin-top centered">
          Nothing to see here
        </div>
      ) : null}

      {/* {(upcomingStreams.length || pastStreams.length) && currentUserProfile ? (
        <>
          <div className="my-streams__header">Upcoming</div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(upcomingStreams)}
          </Masonry>

          <div className="my-streams__header">Past</div>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(pastStreams.reverse())}
          </Masonry>
        </>
      ) : (
        <div className="empty-feed small-margin-top centered">
          Nothing to see here
        </div>
      )} */}
    </div>
  ) : (
    <Redirect to="/" />
  );
};

const mapStateToProps = state => {
  return {
    myStreamsUpcoming: state.myStreamsUpcoming,
    myStreamsPast: state.myStreamsPast
  };
};

export default connect(mapStateToProps, {
  fetchFirstMyStreamsUpcoming,
  fetchMoreMyStreamsUpcoming,
  fetchFirstMyStreamsPast,
  fetchMoreMyStreamsPast
})(MyStreams);
