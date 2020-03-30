import "./styles.scss";
import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";
import { SearchContext } from "../../../providers/Search";

import {
  fetchFirstStreams,
  fetchMoreStreams,
  togglePopup
} from "../../../actions";
import Stream from "./stream";

import Masonry from "react-masonry-css";

const Feed = ({
  streams,
  fetchFirstStreams,
  fetchMoreStreams,
  togglePopup,
  popupShown
}) => {
  const { currentUser, currentUserProfile } = useContext(AuthContext);
  const { searchTerm } = useContext(SearchContext);
  const [lastVisible, setLastVisible] = useState(null);
  const [reachedLast, setReachedLast] = useState(false);

  const loadMore = () => {
    fetchMoreStreams(lastVisible, setLastVisible, setReachedLast);
  };

  useEffect(() => {
    fetchFirstStreams(setLastVisible, searchTerm, setReachedLast);
  }, [searchTerm]);

  const renderItems = streams => {
    return streams.map(stream => {
      return (
        <Stream stream={stream} userUID={currentUser.uid} key={stream.id} />
      );
    });
  };

  const breakpointColumnsObj = {
    default: 4,
    1260: 3,
    840: 2,
    420: 1
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
      {!!streams.length ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {renderItems(streams)}
        </Masonry>
      ) : null}

      {streams.length && !reachedLast ? (
        <div className="feed__load-more" onClick={loadMore}>
          Load More
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    streams: state.streams,
    popupShown: state.popupShown
  };
};

export default connect(mapStateToProps, {
  fetchFirstStreams,
  fetchMoreStreams,
  togglePopup
})(Feed);
