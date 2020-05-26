import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../../providers/Auth";
import { renderSection } from "../../../../utils/feeds";

import { fetchFirstExplore, fetchMoreExplore } from "../../../../actions/feeds";

const Explore = ({ explore, fetchFirstExplore, fetchMoreExplore }) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [lastVisible, setLastVisible] = useState(null);
  const [reachedLast, setReachedLast] = useState(true);

  useEffect(() => {
    fetchFirstExplore(
      setLastVisible,
      setReachedLast,
      currentUserProfile && currentUserProfile.languages
        ? currentUserProfile.languages
        : null
    );
  }, [currentUserProfile, fetchFirstExplore]);

  return (
    <div className="feed">
      {renderSection(
        explore,
        "Public Rooms",
        fetchMoreExplore,
        lastVisible,
        setLastVisible,
        reachedLast,
        setReachedLast,
        currentUserProfile,
        null,
        false
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    explore: state.explore,
  };
};

export default connect(mapStateToProps, {
  fetchFirstExplore,
  fetchMoreExplore,
})(Explore);
