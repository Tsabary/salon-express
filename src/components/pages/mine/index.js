import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";
import { AuthContext } from "../../../providers/Auth";

import {
  fetchFirstMineLive,
  fetchMoreMineLive,
  fetchFirstMineUpcoming,
  fetchMoreMineUpcoming,
  fetchFirstMinePast,
  fetchMoreMinePast,
} from "../../../actions";

import { renderSection } from '../../../utils/feeds';

const Mine = ({
  mineLive,
  mineUpcoming,
  minePast,
  fetchFirstMineLive,
  fetchMoreMineLive,
  fetchFirstMineUpcoming,
  fetchMoreMineUpcoming,
  fetchFirstMinePast,
  fetchMoreMinePast,
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

  return (
    <div className="feed">
      {renderSection(
        mineLive,
        "Live Streams I'm hosting",
        fetchMoreMineLive,
        lastVisibleLive,
        setLastVisibleLive,
        reachedLastLive,
        setReachedLastLive,
        dateNow,
        currentUserProfile
      )}

      {renderSection(
        mineUpcoming,
        "Coming Up Streams I'll Be Hosting",
        fetchMoreMineUpcoming,
        lastVisibleUpcoming,
        setLastVisibleUpcoming,
        reachedLastUpcoming,
        setReachedLastUpcoming,
        dateNow,
        currentUserProfile
      )}

      {renderSection(
        minePast,
        "Past Streams I've Hosted",
        fetchMoreMinePast,
        lastVisiblePast,
        setLastVisiblePast,
        reachedLastPast,
        setReachedLastPast,
        dateNow,
        currentUserProfile
      )}

      {!minePast.length && !mineUpcoming.length && !mineLive.length ? (
        <div className="empty-feed small-margin-top centered">
          Nothing to see here
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    mineLive: state.mineLive,
    mineUpcoming: state.mineUpcoming,
    minePast: state.minePast,
  };
};

export default connect(mapStateToProps, {
  fetchFirstMineLive,
  fetchMoreMineLive,
  fetchFirstMineUpcoming,
  fetchMoreMineUpcoming,
  fetchFirstMinePast,
  fetchMoreMinePast,
})(Mine);
