import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";
import { renderSection } from "../../../utils/feeds";

import {
  fetchFirstExploreLive,
  fetchMoreExploreLive,
  fetchFirstExploreUpcoming,
  fetchMoreExploreUpcoming,
  fetchFirstExplorePast,
  fetchMoreExplorePast,
} from "../../../actions";

const Feed = ({
  exploreLive,
  exploreUpcoming,
  explorePast,
  fetchFirstExploreLive,
  fetchMoreExploreLive,
  fetchFirstExploreUpcoming,
  fetchMoreExploreUpcoming,
  fetchFirstExplorePast,
  fetchMoreExplorePast,
}) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [lastVisibleLive, setLastVisibleLive] = useState(null);
  const [reachedLastLive, setReachedLastLive] = useState(true);

  const [lastVisibleUpcoming, setLastVisibleUpcoming] = useState(null);
  const [reachedLastUpcoming, setReachedLastUpcoming] = useState(true);

  const [lastVisiblePast, setLastVisiblePast] = useState(null);
  const [reachedLastPast, setReachedLastPast] = useState(true);

  const dateNow = new Date();

  useEffect(() => {
    fetchFirstExploreLive(
      setLastVisibleLive,
      setReachedLastLive,
      dateNow,
      currentUserProfile && currentUserProfile.languages
        ? currentUserProfile.languages
        : null
    );
    fetchFirstExploreUpcoming(
      setLastVisibleUpcoming,
      setReachedLastUpcoming,
      dateNow,
      currentUserProfile && currentUserProfile.languages
        ? currentUserProfile.languages
        : null
    );

    fetchFirstExplorePast(
      setLastVisiblePast,
      setReachedLastPast,
      dateNow,
      currentUserProfile && currentUserProfile.languages
        ? currentUserProfile.languages
        : null
    );
  }, []);

  return (
    <div className="feed">
      {renderSection(
        exploreLive,
        "Live Practice Sessions",
        fetchMoreExploreLive,
        lastVisibleLive,
        setLastVisibleLive,
        reachedLastLive,
        setReachedLastLive,
        dateNow,
        currentUserProfile
      )}

      {renderSection(
        exploreUpcoming,
        "Practice Sessions Coming Up",
        fetchMoreExploreUpcoming,
        lastVisibleUpcoming,
        setLastVisibleUpcoming,
        reachedLastUpcoming,
        setReachedLastUpcoming,
        dateNow,
        currentUserProfile
      )}

      {renderSection(
        explorePast,
        "Practice Sessions I've Missed",
        fetchMoreExplorePast,
        lastVisiblePast,
        setLastVisiblePast,
        reachedLastPast,
        setReachedLastPast,
        dateNow,
        currentUserProfile
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    exploreLive: state.exploreLive,
    exploreUpcoming: state.exploreUpcoming,
    explorePast: state.explorePast,
  };
};

export default connect(mapStateToProps, {
  fetchFirstExploreLive,
  fetchMoreExploreLive,
  fetchFirstExploreUpcoming,
  fetchMoreExploreUpcoming,
  fetchFirstExplorePast,
  fetchMoreExplorePast,
})(Feed);
