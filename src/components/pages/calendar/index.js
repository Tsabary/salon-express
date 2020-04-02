import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { AuthContext } from "../../../providers/Auth";

import {
  fetchFirstCalendarLive,
  fetchMoreCalendarLive,
  fetchFirstCalendarUpcoming,
  fetchMoreCalendarUpcoming,
  fetchFirstCalendarPast,
  fetchMoreCalendarPast
} from "../../../actions";
import { breakpointColumnsObj } from "../../../constants";

import Stream from "../../stream";
import Masonry from "react-masonry-css";
import { Redirect } from "react-router-dom";

const Calendar = ({
  calendarLive,
  calendarUpcoming,
  calendarPast,
  fetchFirstCalendarLive,
  fetchMoreCalendarLive,
  fetchFirstCalendarUpcoming,
  fetchMoreCalendarUpcoming,
  fetchFirstCalendarPast,
  fetchMoreCalendarPast
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
    if (currentUser && !calendarLive.length) {
      fetchFirstCalendarLive(
        currentUser.uid,
        setLastVisibleLive,
        setReachedLastLive,
        dateNow
      );

      fetchFirstCalendarUpcoming(
        currentUser.uid,
        setLastVisibleUpcoming,
        setReachedLastUpcoming,
        dateNow
      );

      fetchFirstCalendarPast(
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
    <div className="calendar">
      {calendarLive.length && currentUserProfile ? (
        <>
          <div className="my-streams__header">Live</div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(calendarLive)}
          </Masonry>

          {calendarLive.length && !reachedLastLive ? (
            <div
              className="feed__load-more small-margin-top"
              onClick={() =>
                fetchMoreCalendarLive(
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

      {calendarUpcoming.length && currentUserProfile ? (
        <>
          <div className="my-streams__header">Coming Up</div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(calendarUpcoming)}
          </Masonry>

          {calendarUpcoming.length && !reachedLastUpcoming ? (
            <div
              className="feed__load-more small-margin-top"
              onClick={() =>
                fetchMoreCalendarUpcoming(
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

      {calendarPast.length && currentUserProfile ? (
        <>
          <div className="my-streams__header">Past</div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(calendarPast)}
          </Masonry>

          {calendarPast.length && !reachedLastPast ? (
            <div
              className="feed__load-more small-margin-top"
              onClick={() =>
                fetchMoreCalendarPast(
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

      {!calendarPast.length && !calendarUpcoming.length ? (
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
    calendarLive: state.calendarLive,
    calendarUpcoming: state.calendarUpcoming,
    calendarPast: state.calendarPast
  };
};

export default connect(mapStateToProps, {
  fetchFirstCalendarLive,
  fetchMoreCalendarLive,
  fetchFirstCalendarUpcoming,
  fetchMoreCalendarUpcoming,
  fetchFirstCalendarPast,
  fetchMoreCalendarPast
})(Calendar);
