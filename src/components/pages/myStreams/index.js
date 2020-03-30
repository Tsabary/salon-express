import "./styles.scss";
import React, { useEffect, useContext } from "react";
import { connect } from "react-redux";
import { AuthContext } from "../../../providers/Auth";

import { fetchMyStreams } from "../../../actions";
import Stream from "../feed/stream";
import Masonry from "react-masonry-css";

const MyStreams = ({ myStreams, fetchMyStreams }) => {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) fetchMyStreams(currentUser.uid);
  }, [currentUser]);

  const renderItems = () => {
    return myStreams.map(stream => {
      return (
        <Stream stream={stream} userUID={currentUser.uid} key={stream.id} />
      );
    });
  };

  const breakpointColumnsObj = {
    default: 4,
    1440: 3,
    960: 2,
    480: 1
  };

  return (
    <div className="my-streams">
      {!!myStreams.length ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {renderItems()}
        </Masonry>
      ) : (
        <div className="empty-feed small-margin-top centered">
          Nothing to see here
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    myStreams: state.myStreams
  };
};

export default connect(mapStateToProps, { fetchMyStreams })(MyStreams);
