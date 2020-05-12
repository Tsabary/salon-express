import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../../providers/Auth";
import { renderSection } from "../../../../utils/feeds";

import { fetchFirstFloors, fetchMoreFloors } from "../../../../actions/feeds";

const Floors = ({ floors, fetchFirstFloors, fetchMoreFloors }) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [lastVisible, setLastVisible] = useState(null);
  const [reachedLast, setReachedLast] = useState(true);

  useEffect(() => {
    console.log("my flooors", floors);
  }, [floors]);

  useEffect(() => {
    fetchFirstFloors(
      setLastVisible,
      setReachedLast,
      currentUserProfile && currentUserProfile.languages
        ? currentUserProfile.languages
        : null
    );
  }, [currentUserProfile, fetchFirstFloors]);

  return (
    <div className="feed">
      {renderSection(
        floors,
        "Explore Floors",
        fetchMoreFloors,
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
    floors: state.floors,
  };
};

export default connect(mapStateToProps, {
  fetchFirstFloors,
  fetchMoreFloors,
})(Floors);
