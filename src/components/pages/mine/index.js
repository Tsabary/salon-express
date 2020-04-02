import "./styles.scss";
import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";
import { AuthContext } from "../../../providers/Auth";

import {
  fetchFirstMineLive,
  fetchMoreMineLive,
  fetchFirstMineUpcoming,
  fetchMoreMineUpcoming,
  fetchFirstMinePast,
  fetchMoreMinePast
} from "../../../actions";
import { breakpointColumnsObj } from "../../../constants";
import Stream from "../../stream";
import Masonry from "react-masonry-css";
import { Redirect } from "react-router-dom";

const Mine = ({
  mineLive,
  mineUpcoming,
  minePast,
  fetchFirstMineLive,
  fetchMoreMineLive,
  fetchFirstMineUpcoming,
  fetchMoreMineUpcoming,
  fetchFirstMinePast,
  fetchMoreMinePast
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
    if (currentUser && !mineLive.length) {
      fetchFirstMineLive(
        currentUser.uid,
        setLastVisibleLive,
        setReachedLastLive,
        dateNow
      );
    }

    if (currentUser && !mineUpcoming.length) {
      fetchFirstMineUpcoming(
        currentUser.uid,
        setLastVisibleUpcoming,
        setReachedLastUpcoming,
        dateNow
      );
    }

    if (currentUser && !minePast.length) {
      fetchFirstMinePast(
        currentUser.uid,
        setLastVisiblePast,
        setReachedLastPast,
        dateNow
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
      {mineLive.length && currentUserProfile ? (
        <>
          <div className="my-streams__header">Live</div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(mineLive)}
          </Masonry>

          {mineLive.length && !reachedLastLive ? (
            <div
              className="feed__load-more small-margin-top"
              onClick={() =>
                fetchMoreMineLive(
                  currentUser.uid,
                  lastVisibleLive,
                  setLastVisibleLive,
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

      {mineUpcoming.length && currentUserProfile ? (
        <>
          <div className="my-streams__header">Coming Up</div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(mineUpcoming)}
          </Masonry>

          {mineUpcoming.length && !reachedLastUpcoming ? (
            <div
              className="feed__load-more small-margin-top"
              onClick={() =>
                fetchMoreMineUpcoming(
                  currentUser.uid,
                  lastVisibleUpcoming,
                  setLastVisibleUpcoming,
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

      {minePast.length && currentUserProfile ? (
        <>
          <div className="my-streams__header">Past</div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(minePast)}
          </Masonry>

          {minePast.length && !reachedLastPast ? (
            <div
              className="feed__load-more small-margin-top"
              onClick={() =>
                fetchMoreMinePast(
                  currentUser.uid,
                  lastVisiblePast,
                  setLastVisiblePast,
                  setReachedLastPast,
                  dateNow
                )
              }
            >
              Load More
            </div>
          ) : null}
        </>
      ) : null}

      {!minePast.length && !mineUpcoming.length ? (
        <div className="empty-feed small-margin-top centered">
          Nothing to see here
        </div>
      ) : null}
    </div>
  ) : (
    <Redirect to="/" />
  );
};

const mapStateToProps = state => {
  return {
    mineLive: state.mineLive,
    mineUpcoming: state.mineUpcoming,
    minePast: state.minePast
  };
};

export default connect(mapStateToProps, {
  fetchFirstMineLive,
  fetchMoreMineLive,
  fetchFirstMineUpcoming,
  fetchMoreMineUpcoming,
  fetchFirstMinePast,
  fetchMoreMinePast
})(Mine);
