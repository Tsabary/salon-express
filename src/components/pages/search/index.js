import "./styles.scss";
import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";
import { breakpointColumnsObj } from "../../../constants";

import {
  fetchFirstSearchedLive,
  fetchMoreSearchedLive,
  fetchFirstSearchedUpcoming,
  fetchMoreSearchedUpcoming,
  togglePopup
} from "../../../actions";
import Stream from "../../stream";

import Masonry from "react-masonry-css";

const Search = ({
  match,
  searchLive,
  searchUpcoming,
  fetchFirstSearchedLive,
  fetchMoreSearchedLive,
  fetchFirstSearchedUpcoming,
  fetchMoreSearchedUpcoming
}) => {
  const { currentUser, currentUserProfile } = useContext(AuthContext);
  const [lastVisibleLive, setLastVisibleLive] = useState(null);
  const [reachedLastLive, setReachedLastLive] = useState(true);
  const [lastVisibleUpcoming, setLastVisibleUpcoming] = useState(null);
  const [reachedLastUpcoming, setReachedLastUpcoming] = useState(true);
  const dateNow = new Date();

  useEffect(() => {

    console.log(match.params.id)

    fetchFirstSearchedLive(
      setLastVisibleLive,
      match.params.id,
      setReachedLastLive,
      dateNow
    );

    fetchFirstSearchedUpcoming(
      setLastVisibleUpcoming,
      match.params.id,
      setReachedLastUpcoming,
      dateNow
    );
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
    <div className="search">
      {searchLive.length ? (
        <>
          <div className="my-streams__header">Live</div>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(searchLive)}
          </Masonry>
          {searchLive.length && !reachedLastLive ? (
            <div
              className="feed__load-more"
              onClick={() =>
                fetchMoreSearchedLive(
                  lastVisibleLive,
                  setLastVisibleLive,
                  match.params.id,
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

      {searchUpcoming.length ? (
        <>
          <div className="my-streams__header">Coming up</div>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {renderItems(searchUpcoming)}
          </Masonry>
          {searchUpcoming.length && !reachedLastUpcoming ? (
            <div
              className="feed__load-more"
              onClick={() =>
                fetchMoreSearchedUpcoming(
                  lastVisibleUpcoming,
                  setLastVisibleUpcoming,
                  match.params.id,
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
    </div>
  );
};

const mapStateToProps = state => {
  return {
    searchLive: state.searchLive,
    searchUpcoming: state.searchUpcoming,
    popupShown: state.popupShown
  };
};

export default connect(mapStateToProps, {
  fetchFirstSearchedLive,
  fetchMoreSearchedLive,
  fetchFirstSearchedUpcoming,
  fetchMoreSearchedUpcoming,
  togglePopup
})(Search);
