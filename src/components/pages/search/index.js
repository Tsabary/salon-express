import "./styles.scss";
import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";

import { renderSection } from "../../../utils/feeds";
import { capitalizeAndRemoveHyphens } from "../../../utils/strings";

import { fetchFirstSearched, fetchMoreSearched } from "../../../actions/feeds";

const Search = ({ match, searched, fetchFirstSearched, fetchMoreSearched }) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [lastVisible, setLastVisible] = useState(null);
  const [reachedLast, setReachedLast] = useState(true);

  useEffect(() => {
    fetchFirstSearched(
      setLastVisible,
      setReachedLast,
      match.params.id,
      currentUserProfile && currentUserProfile.languages
        ? currentUserProfile.languages
        : null
    );
  }, [currentUserProfile]);

  return (
    <div className="search">
      {renderSection(
        searched,
        `Rooms related to ${capitalizeAndRemoveHyphens(match.params.id)}`,
        fetchMoreSearched,
        lastVisible,
        setLastVisible,
        reachedLast,
        setReachedLast,
        currentUserProfile,
        match.params.id
      )}

      {!searched.length ? (
        <div className="empty-feed small-margin-top centered">
          This is a fresh topic! Want to talk about it? Open a new Room!
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    searched: state.searched,
    popupShown: state.popupShown,
  };
};

export default connect(mapStateToProps, {
  fetchFirstSearched,
  fetchMoreSearched,
})(Search);
