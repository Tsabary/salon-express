import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { AuthContext } from "../../../providers/Auth";

import { fetchFirstCalendar, fetchMoreCalendar } from "../../../actions";
import Stream from "../feed/stream";
import Masonry from "react-masonry-css";

const Calendar = ({ calendar, fetchFirstCalendar, fetchMoreCalendar }) => {
  const { currentUser } = useContext(AuthContext);
  const [lastVisible, setLastVisible] = useState(null);
  const [reachedLast, setReachedLast] = useState(false);

  useEffect(() => {
    console.log("caliing calender");

    if (currentUser) {
      console.log("caliing calender");
      fetchFirstCalendar(currentUser.uid, setLastVisible, setReachedLast);
    }
  }, [currentUser]);

  const renderItems = () => {
    return calendar.map(stream => {
      return (
        <Stream stream={stream} userUID={currentUser.uid} key={stream.id} />
      );
    });
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="calendar">
      {!!calendar.length ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {renderItems()}
        </Masonry>
      ) : (
        <div className="empty-feed small-margin-top centered">
          Nothing to see here
        </div>
      )}
      {calendar.length && !reachedLast ? (
        <div
          className="feed__load-more"
          onClick={() =>
            fetchMoreCalendar(currentUser.uid, lastVisible, setLastVisible, setReachedLast)
          }
        >
          Load More
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    calendar: state.calendar
  };
};

export default connect(mapStateToProps, {
  fetchFirstCalendar,
  fetchMoreCalendar
})(Calendar);
