import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";
import { renderSection } from "../../../utils/feeds";

import {
  fetchFirstExploreLive,
  fetchMoreExploreLive,
  fetchFirstExploreUpcoming,
  fetchMoreExploreUpcoming,
} from "../../../actions";

const Feed = ({
  exploreLive,
  exploreUpcoming,
  fetchFirstExploreLive,
  fetchMoreExploreLive,
  fetchFirstExploreUpcoming,
  fetchMoreExploreUpcoming,
}) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [lastVisibleLive, setLastVisibleLive] = useState(null);
  const [reachedLastLive, setReachedLastLive] = useState(true);

  const [lastVisibleUpcoming, setLastVisibleUpcoming] = useState(null);
  const [reachedLastUpcoming, setReachedLastUpcoming] = useState(true);

  const dateNow = new Date();

  useEffect(() => {
    fetchFirstExploreLive(setLastVisibleLive, setReachedLastLive, dateNow);
    fetchFirstExploreUpcoming(
      setLastVisibleUpcoming,
      setReachedLastUpcoming,
      dateNow
    );
  }, []);

  return (
    <div className="feed">
      {renderSection(
        exploreLive,
        "Live Everywhere",
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
        "Coming Up Everywhere",
        fetchMoreExploreUpcoming,
        lastVisibleUpcoming,
        setLastVisibleUpcoming,
        reachedLastUpcoming,
        setReachedLastUpcoming,
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
  };
};

export default connect(mapStateToProps, {
  fetchFirstExploreLive,
  fetchMoreExploreLive,
  fetchFirstExploreUpcoming,
  fetchMoreExploreUpcoming,
})(Feed);
