import React from "react";
import Masonry from "react-masonry-css";
import { breakpointColumnsObj } from "../constants";
import Room from "../components/otherComponents/room";
import Floor from "../components/otherComponents/floor";

const renderRooms = (rooms, currentUserProfile) => {
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

const renderFloors = (floors, currentUserProfile) => {
  return floors.map((floor) => {
    return (
      <Floor
        floor={floor}
        currentUserProfile={
          currentUserProfile || { uid: "", following: [], followers: [] }
        }
        isForFeed
        key={floor.id}
      />
    );
  });
};

export const renderSection = (
  collection,
  title,
  fetchMore,
  lastVisible,
  setLastVisible,
  reachedLast,
  setReachedLast,
  currentUserProfile,
  tag,
  isFloor
) => {
  return collection.length ? (
    <>
      <div className="feed__header">{title}</div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {isFloor
          ? renderFloors(collection, currentUserProfile)
          : renderRooms(collection, currentUserProfile)}
      </Masonry>

      {collection.length && !reachedLast ? (
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
