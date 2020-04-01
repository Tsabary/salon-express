import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { AuthContext } from "../../../providers/Auth";

import {
  fetchFirstCalendarUpcoming,
  fetchMoreCalendarUpcoming,
  fetchFirstCalendarPast,
  fetchMoreCalendarPast
} from "../../../actions";
import { breakpointColumnsObj } from "../../../constants";

import Stream from "../feed/stream";
import Masonry from "react-masonry-css";
import { Redirect } from "react-router-dom";

const Calendar = ({
  calendarUpcoming,
  calendarPast,
  fetchFirstCalendarUpcoming,
  fetchMoreCalendarUpcoming,
  fetchFirstCalendarPast,
  fetchMoreCalendarPast
}) => {
  const { currentUser, currentUserProfile } = useContext(AuthContext);
  const [lastVisibleUpcoming, setLastVisibleUpcoming] = useState(null);
  const [lastVisiblePast, setLastVisiblePast] = useState(null);
  const [reachedLastUpcoming, setReachedLastUpcoming] = useState(true);
  const [reachedLastPast, setReachedLastPast] = useState(true);

  useEffect(() => {
    if (currentUser && !calendarUpcoming.length) {
      fetchFirstCalendarUpcoming(currentUser.uid, setLastVisibleUpcoming, setReachedLastUpcoming);
      fetchFirstCalendarPast(currentUser.uid, setLastVisiblePast, setReachedLastPast);
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
                  setReachedLastUpcoming
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
                  setReachedLastPast
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
    calendarUpcoming: state.calendarUpcoming,
    calendarPast: state.calendarPast
  };
};

export default connect(mapStateToProps, {
  fetchFirstCalendarUpcoming,
  fetchMoreCalendarUpcoming,
  fetchFirstCalendarPast,
  fetchMoreCalendarPast
})(Calendar);
