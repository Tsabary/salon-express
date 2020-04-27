import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";
import { AuthContext } from "../../../providers/Auth";

import { fetchFirstMyRooms, fetchMoreMyRooms} from "../../../actions";

import { renderSection } from "../../../utils/feeds";

const MyRooms = ({ myRooms, fetchFirstMyRooms, fetchMoreMyRooms }) => {
  const { currentUser, currentUserProfile } = useContext(AuthContext);

  const [lastVisible, setLastVisible] = useState(null);
  const [reachedLast, setReachedLast] = useState(true);

  useEffect(() => {
    if (currentUser && !myRooms.length) {
      fetchFirstMyRooms(
        setLastVisible,
        setReachedLast,
        currentUser.uid
      );
    }
  }, [currentUser, fetchFirstMyRooms, myRooms]);

  return (
    <div className="feed">
      {renderSection(
        myRooms,
        "My Rooms",
        fetchMoreMyRooms,
        lastVisible,
        setLastVisible,
        reachedLast,
        setReachedLast,
        currentUserProfile
      )}

      {!myRooms.length  ? (
        <div className="empty-feed small-margin-top centered">
          Nothing to see here. Open your new Room!
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    myRooms: state.myRooms,
  };
};

export default connect(mapStateToProps, {
  fetchFirstMyRooms, fetchMoreMyRooms
})(MyRooms);
