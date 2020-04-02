import "./styles.scss";
import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";
import { breakpointColumnsObj } from "../../../constants";

import {
  fetchFirstExploreLive,
  fetchMoreExploreLive,
  fetchFirstExploreUpcoming,
  fetchMoreExploreUpcoming,
  togglePopup,
  deleteTags
} from "../../../actions";
import Stream from "../../stream";

import Masonry from "react-masonry-css";

const Feed = ({
  exploreLive,
  exploreUpcoming,
  fetchFirstExploreLive,
  fetchMoreExploreLive,
  fetchFirstExploreUpcoming,
  fetchMoreExploreUpcoming,
  togglePopup,
  popupShown
}) => {
  const { currentUser, currentUserProfile } = useContext(AuthContext);
  const [lastVisibleLive, setLastVisibleLive] = useState(null);
  const [reachedLastLive, setReachedLastLive] = useState(true);
  const [lastVisibleUpcoming, setLastVisibleUpcoming] = useState(null);
  const [reachedLastUpcoming, setReachedLastUpcoming] = useState(true);
  const dateNow = new Date();

  useEffect(() => {
    //****DANGOROUS*****/
    // deleteTags();
    //****DANGOROUS*****/

    fetchFirstExploreLive(setLastVisibleLive, setReachedLastLive, dateNow);
    fetchFirstExploreUpcoming(setLastVisibleUpcoming, setReachedLastUpcoming, dateNow);
  }, []);

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
      {exploreLive.length ? (
        <>
          <div className="my-streams__header">Live</div>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(exploreLive)}
          </Masonry>

          {exploreLive.length && !reachedLastLive ? (
            <div
              className="feed__load-more"
              onClick={() =>
                fetchMoreExploreLive(
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

      {exploreUpcoming.length ? (
        <>
          <div className="my-streams__header">Coming up</div>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(exploreUpcoming)}
          </Masonry>

          {exploreUpcoming.length && !reachedLastUpcoming ? (
            <div
              className="feed__load-more"
              onClick={() =>
                fetchMoreExploreUpcoming(
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

      
      {/* NEW STREAM BUTTON */}
      <a
        style={{ display: popupShown ? "none" : "" }}
        onClick={togglePopup}
        className="post-button"
        href={
          currentUser && currentUser.emailVerified ? "#add-stream" : "#sign-up"
        }
      >
        +
      </a>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    exploreLive: state.exploreLive,
    exploreUpcoming: state.exploreUpcoming,
    popupShown: state.popupShown
  };
};

export default connect(mapStateToProps, {
  fetchFirstExploreLive,
  fetchMoreExploreLive,
  fetchFirstExploreUpcoming,
  fetchMoreExploreUpcoming,
  togglePopup,
  deleteTags
})(Feed);
