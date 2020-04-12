import "./styles.scss";
import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";

import { renderSection } from "../../../utils/feeds";
import { capitalizeAndRemoveHyphens } from "../../../utils/strings";

import {
  fetchFirstSearchedLive,
  fetchMoreSearchedLive,
  fetchFirstSearchedUpcoming,
  fetchMoreSearchedUpcoming,
  fetchFirstSearchedPast,
  fetchMoreSearchedPast,
  togglePopup,
} from "../../../actions";

const Search = ({
  match,
  searchLive,
  searchUpcoming,
  searchPast,
  fetchFirstSearchedLive,
  fetchMoreSearchedLive,
  fetchFirstSearchedUpcoming,
  fetchMoreSearchedUpcoming,
  fetchFirstSearchedPast,
  fetchMoreSearchedPast,
}) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [lastVisibleLive, setLastVisibleLive] = useState(null);
  const [reachedLastLive, setReachedLastLive] = useState(true);

  const [lastVisibleUpcoming, setLastVisibleUpcoming] = useState(null);
  const [reachedLastUpcoming, setReachedLastUpcoming] = useState(true);

  const [lastVisiblePast, setLastVisiblePast] = useState(null);
  const [reachedLastPast, setReachedLastPast] = useState(true);

  const dateNow = new Date();

  useEffect(() => {
    fetchFirstSearchedLive(
      setLastVisibleLive,
      setReachedLastLive,
      dateNow,
      match.params.id,
      currentUserProfile && currentUserProfile.languages
        ? currentUserProfile.languages
        : null
    );

    fetchFirstSearchedUpcoming(
      setLastVisibleUpcoming,
      setReachedLastUpcoming,
      dateNow,
      match.params.id,
      currentUserProfile && currentUserProfile.languages
        ? currentUserProfile.languages
        : null
    );

    fetchFirstSearchedPast(
      setLastVisiblePast,
      setReachedLastPast,
      dateNow,
      match.params.id,
      currentUserProfile && currentUserProfile.languages
        ? currentUserProfile.languages
        : null
    );
  }, [currentUserProfile]);

  return (
    <div className="search">
      {renderSection(
        searchLive,
        `Live Practice Sessions on ${capitalizeAndRemoveHyphens(
          match.params.id
        )}`,
        fetchMoreSearchedLive,
        lastVisibleLive,
        setLastVisibleLive,
        reachedLastLive,
        setReachedLastLive,
        dateNow,
        currentUserProfile,
        match.params.id
      )}

      {renderSection(
        searchUpcoming,
        `Future Practice Sessions on ${capitalizeAndRemoveHyphens(
          match.params.id
        )}`,
        fetchMoreSearchedUpcoming,
        lastVisibleUpcoming,
        setLastVisibleUpcoming,
        reachedLastUpcoming,
        setReachedLastUpcoming,
        dateNow,
        currentUserProfile,
        match.params.id
      )}

      {renderSection(
        searchPast,
        `Practice Sessions I've Missed on ${capitalizeAndRemoveHyphens(
          match.params.id
        )}`,
        fetchMoreSearchedPast,
        lastVisiblePast,
        setLastVisiblePast,
        reachedLastPast,
        setReachedLastPast,
        dateNow,
        currentUserProfile,
        match.params.id
      )}

      {!searchLive.length && !searchUpcoming.length && !searchPast.length ? (
        <div className="empty-feed small-margin-top centered">
          This is a fresh topic! Want to talk about it? Host a practice session!
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    searchLive: state.searchLive,
    searchUpcoming: state.searchUpcoming,
    searchPast: state.searchPast,
    popupShown: state.popupShown,
  };
};

export default connect(mapStateToProps, {
  fetchFirstSearchedLive,
  fetchMoreSearchedLive,
  fetchFirstSearchedUpcoming,
  fetchMoreSearchedUpcoming,
  fetchFirstSearchedPast,
  fetchMoreSearchedPast,
  togglePopup,
})(Search);
