import React from "react";
import Masonry from "react-masonry-css";
import { breakpointColumnsObj } from "../constants";
import Room from "../components/room";

const renderItems = (rooms, currentUserProfile) => {
  return rooms.map((room) => {
    return (
      <Room
        room={room}
        currentUserProfile={
          currentUserProfile || { uid: "", following: [], followers: [] }
        }
        isForFeed
        key={room.id}
      />
    );
  });
};

export const renderSection = (
  rooms,
  title,
  fetchMore,
  lastVisible,
  setLastVisible,
  reachedLast,
  setReachedLast,
  currentUserProfile,
  tag
) => {
  return rooms.length ? (
    <>
      <div className="feed__header">{title}</div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {renderItems(rooms, currentUserProfile)}
      </Masonry>

      {rooms.length && !reachedLast ? (
        <div
          className="feed__load-more"
          onClick={() =>
            fetchMore(
              lastVisible,
              setLastVisible,
              setReachedLast,
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
