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
        setLastVisibleLive,
        setReachedLastLive,
        dateNow,
        currentUser.uid
      );

      fetchFirstCalendarUpcoming(
        setLastVisibleUpcoming,
        setReachedLastUpcoming,
        dateNow,
        currentUser.uid
      );

      fetchFirstCalendarPast(
        setLastVisiblePast,
        setReachedLastPast,
        dateNow,
        currentUser.uid
      );
    }
  }, [currentUser]);

  return (
    <div className="feed">
      {renderSection(
        calendarLive,
        "Live Practice Sessions I'm Into",
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
        "Practice Sessions I'll be Attending",
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
        "Practice Sessions I've Attended",
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
          Nothing to see here. Attend your first practice session!
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
