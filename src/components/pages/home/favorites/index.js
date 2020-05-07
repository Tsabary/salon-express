import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";
import { AuthContext } from "../../../../providers/Auth";

import { fetchFirstFavorites, fetchMoreFavorites } from "../../../../actions";

import { renderSection } from "../../../../utils/feeds";

const Favorites = ({ favorites, fetchFirstFavorites, fetchMoreFavorites }) => {
  const { currentUser, currentUserProfile } = useContext(AuthContext);

  const [lastVisible, setLastVisible] = useState(null);
  const [reachedLast, setReachedLast] = useState(true);

  useEffect(() => {
    if (currentUser && !favorites.length) {
      fetchFirstFavorites(setLastVisible, setReachedLast, currentUser.uid);
    }
  }, [currentUser, fetchFirstFavorites, favorites]);

  return (
    <div className="feed">
      {renderSection(
        favorites,
        "My Favorite Rooms",
        fetchMoreFavorites,
        lastVisible,
        setLastVisible,
        reachedLast,
        setReachedLast,
        currentUserProfile,
        null,
        false
      )}

      {!favorites.length ? (
        <div className="empty-feed small-margin-top centered">
          Nothing to see here. Start keeping your favorite rooms!
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    favorites: state.favorites,
  };
};

export default connect(mapStateToProps, {
  fetchFirstFavorites,
  fetchMoreFavorites,
})(Favorites);
