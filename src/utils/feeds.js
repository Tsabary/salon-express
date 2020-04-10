import React from "react";
import Masonry from "react-masonry-css";
import { breakpointColumnsObj } from "../constants";
import Stream from "../components/stream";

const renderItems = (streams, currentUserProfile) => {
  return streams.map((stream) => {
    return (
      <Stream
        stream={stream}
        currentUserProfile={
          currentUserProfile || { uid: "", following: [], followers: [] }
        }
        key={stream.id}
      />
    );
  });
};

export const renderSection = (
  streams,
  title,
  fetchMore,
  lastVisible,
  setLastVisible,
  reachedLast,
  setReachedLast,
  dateNow,
  currentUserProfile,
  tag
) => {
  return streams.length ? (
    <>
      <div className="feed__header">{title}</div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {renderItems(streams, currentUserProfile)}
      </Masonry>

      {streams.length && !reachedLast ? (
        <div
          className="feed__load-more"
          onClick={() =>
            fetchMore(
              lastVisible,
              setLastVisible,
              setReachedLast,
              dateNow,
              currentUserProfile ? currentUserProfile.uid : null,
              tag,
              currentUserProfile ? currentUserProfile.languages : null
            )
          }
        >
          Load More
        </div>
      ) : null}
    </>
  ) : null;
};
