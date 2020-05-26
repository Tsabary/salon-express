import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../../providers/Auth";
import { renderSection } from "../../../../utils/feeds";

import {
  fetchFirstExploreFloors,
  fetchMoreExploreFloors,
} from "../../../../actions/feeds";

const Floors = ({
  exploreFloors,
  fetchFirstExploreFloors,
  fetchMoreExploreFloors,
}) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [lastVisible, setLastVisible] = useState(null);
  const [reachedLast, setReachedLast] = useState(true);

  useEffect(() => {
    fetchFirstExploreFloors(
      setLastVisible,
      setReachedLast,
      currentUserProfile && currentUserProfile.languages
        ? currentUserProfile.languages
        : null
    );
  }, [currentUserProfile, fetchFirstExploreFloors]);

  return (
    <div className="feed">
      {renderSection(
        exploreFloors,
        "Public Floors",
        fetchMoreExploreFloors,
        lastVisible,
        setLastVisible,
        reachedLast,
        setReachedLast,
        currentUserProfile,
        null,
        true
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    exploreFloors: state.exploreFloors,
  };
};

export default connect(mapStateToProps, {
  fetchFirstExploreFloors,
  fetchMoreExploreFloors,
})(Floors);
