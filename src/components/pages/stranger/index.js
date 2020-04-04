import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";

import Masonry from "react-masonry-css";

import { AuthContext } from "../../../providers/Auth";
import { breakpointColumnsObj } from "../../../constants";

import Stream from "../../stream";

import {
  fetchStrangerProfile,
  fetchFirstStrangerLive,
  fetchMoreStrangerLive,
  fetchFirstStrangerUpcoming,
  fetchMoreStrangerUpcoming,
  fetchFirstStrangerPast,
  fetchMoreStrangerPast,
} from "../../../actions";

const Stranger = ({
  match,
  strangerLive,
  strangerUpcoming,
  strangerPast,
  strangerProfile,
  fetchFirstStrangerLive,
  fetchMoreStrangerLive,
  fetchFirstStrangerUpcoming,
  fetchMoreStrangerUpcoming,
  fetchFirstStrangerPast,
  fetchMoreStrangerPast,
  fetchStrangerProfile,
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
    console.log("username", match.params.id)
    if (match.params.id) {
      fetchStrangerProfile(match.params.id);
    }
  }, [match.params.id]);

  useEffect(() => {
    console.log("strangerProfile", strangerProfile)

    if (strangerProfile && !strangerLive.length) {
      console.log(strangerProfile.uid);
      fetchFirstStrangerLive(
        strangerProfile.uid,
        setLastVisibleLive,
        setReachedLastLive,
        dateNow
      );
    }

    if (strangerProfile && !strangerUpcoming.length) {
      console.log(strangerProfile.uid);

      fetchFirstStrangerUpcoming(
        strangerProfile.uid,
        setLastVisibleUpcoming,
        setReachedLastUpcoming,
        dateNow
      );
    }

    if (strangerProfile && !strangerPast.length) {
      console.log(strangerProfile.uid);

      fetchFirstStrangerPast(
        strangerProfile.uid,
        setLastVisiblePast,
        setReachedLastPast,
        dateNow
      );
    }
  }, [strangerProfile]);

  const renderItems = (streams) => {
    return streams.map((stream) => {
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
    <div className="my-streams">
      {strangerLive.length ? (
        <>
          <div className="my-streams__header">Live Streams by {strangerProfile.name}</div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(strangerLive)}
          </Masonry>

          {strangerLive.length && !reachedLastLive ? (
            <div
              className="feed__load-more small-margin-top"
              onClick={() =>
                fetchMoreStrangerLive(
                  strangerProfile.uid,
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

      {strangerUpcoming.length ? (
        <>
          <div className="my-streams__header">Coming Up Streams by {strangerProfile.name}</div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(strangerUpcoming)}
          </Masonry>

          {strangerUpcoming.length && !reachedLastUpcoming ? (
            <div
              className="feed__load-more small-margin-top"
              onClick={() =>
                fetchMoreStrangerUpcoming(
                  strangerProfile.uid,
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

      {strangerPast.length ? (
        <>
          <div className="my-streams__header">Past Streams by {strangerProfile.name}</div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(strangerPast)}
          </Masonry>

          {strangerPast.length && !reachedLastPast ? (
            <div
              className="feed__load-more small-margin-top"
              onClick={() =>
                fetchMoreStrangerPast(
                  strangerProfile.uid,
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

      {!strangerPast.length &&
      !strangerUpcoming.length &&
      !strangerLive.length ? (
        <div className="empty-feed small-margin-top centered">
          Nothing to see here
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    strangerLive: state.strangerLive,
    strangerUpcoming: state.strangerUpcoming,
    strangerPast: state.strangerPast,
    strangerProfile: state.strangerProfile,
  };
};

export default connect(mapStateToProps, {
  fetchStrangerProfile,
  fetchFirstStrangerLive,
  fetchMoreStrangerLive,
  fetchFirstStrangerUpcoming,
  fetchMoreStrangerUpcoming,
  fetchFirstStrangerPast,
  fetchMoreStrangerPast,
})(Stranger);

//////////////////language choice and filrter/////////////////
