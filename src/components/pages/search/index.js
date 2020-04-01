import "./styles.scss";
import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";
import { SearchContext } from "../../../providers/Search";
import { breakpointColumnsObj } from "../../../constants";

import {
  fetchFirstSearchedStreams,
  fetchMoreSearchedStreams,
  togglePopup
} from "../../../actions";
import Stream from "../feed/stream";

import Masonry from "react-masonry-css";

const Search = ({
  searchedStreams,
  fetchFirstSearchedStreams,
  fetchMoreSearchedStreams,
  togglePopup,
  popupShown
}) => {
  const { currentUser, currentUserProfile } = useContext(AuthContext);
  const { searchTerm } = useContext(SearchContext);
  const [lastVisible, setLastVisible] = useState(null);
  const [reachedLast, setReachedLast] = useState(true);
  const timestampNow = Date.now();

  useEffect(() => {
    if (searchTerm) {
      fetchFirstSearchedStreams(
        setLastVisible,
        searchTerm,
        setReachedLast,
        timestampNow
      );
    }
  }, [searchTerm]);

  const loadMore = () => {
    fetchMoreSearchedStreams(
      lastVisible,
      setLastVisible,
      searchTerm,
      setReachedLast,
      timestampNow
    );
  };

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
      <a
        style={{ display: popupShown ? "none" : "" }}
        onClick={togglePopup}
        className="post-button"
        href={
          currentUser && currentUser.emailVerified ? "#new-stream" : "#sign-up"
        }
      >
        +
      </a>
      {!!searchedStreams.length ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {renderItems(searchedStreams)}
        </Masonry>
      ) : null}

      {searchedStreams.length && !reachedLast ? (
        <div className="feed__load-more" onClick={loadMore}>
          Load More
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    searchedStreams: state.searchedStreams,
    popupShown: state.popupShown
  };
};

export default connect(mapStateToProps, {
  fetchFirstSearchedStreams,
  fetchMoreSearchedStreams,
  togglePopup
})(Search);
