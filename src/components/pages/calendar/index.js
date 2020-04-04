import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { AuthContext } from "../../../providers/Auth";

import {
  fetchFirstCalendarLive,
  fetchMoreCalendarLive,
  fetchFirstCalendarUpcoming,
  fetchMoreCalendarUpcoming,
  fetchFirstCalendarPast,
  fetchMoreCalendarPast,
} from "../../../actions";

import { renderSection } from "../../../utils/feeds";

const Calendar = ({
  calendarLive,
  calendarUpcoming,
  calendarPast,
  fetchFirstCalendarLive,
  fetchMoreCalendarLive,
  fetchFirstCalendarUpcoming,
  fetchMoreCalendarUpcoming,
  fetchFirstCalendarPast,
  fetchMoreCalendarPast,
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

  return (
    <div className="feed">
      {renderSection(
        calendarLive,
        "Live Streams I'm Into",
        fetchMoreCalendarLive,
        lastVisibleLive,
        setLastVisibleLive,
        reachedLastLive,
        setReachedLastLive,
        dateNow,
        currentUserProfile
      )}

      {renderSection(
        calendarUpcoming,
        "Coming Up and I'm Going",
        fetchMoreCalendarUpcoming,
        lastVisibleUpcoming,
        setLastVisibleUpcoming,
        reachedLastUpcoming,
        setReachedLastUpcoming,
        dateNow,
        currentUserProfile
      )}

      {renderSection(
        calendarPast,
        "Past Streams I Attended",
        fetchMoreCalendarPast,
        lastVisiblePast,
        setLastVisiblePast,
        reachedLastPast,
        setReachedLastPast,
        dateNow,
        currentUserProfile
      )}

      {!calendarPast.length && !calendarUpcoming.length ? (
        <div className="empty-feed small-margin-top centered">
          Nothing to see here
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    calendarLive: state.calendarLive,
    calendarUpcoming: state.calendarUpcoming,
    calendarPast: state.calendarPast,
  };
};

export default connect(mapStateToProps, {
  fetchFirstCalendarLive,
  fetchMoreCalendarLive,
  fetchFirstCalendarUpcoming,
  fetchMoreCalendarUpcoming,
  fetchFirstCalendarPast,
  fetchMoreCalendarPast,
})(Calendar);
