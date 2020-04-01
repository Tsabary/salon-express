import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { connect } from "react-redux";
import history from "../../../history";

// import Moment from "react-moment";
// import { CopyToClipboard } from "react-copy-to-clipboard";
// import ReactTooltip from "react-tooltip";

import { AuthContext } from "../../../providers/Auth";
import { PageContext } from "../../../providers/Page";

import { fetchSingleStream } from "../../../actions";
import Stream from "../feed/stream";

const SingleStream = ({ match, streams, fetchSingleStream }) => {
  const myHistory = useHistory(history);

  const { currentUser, currentUserProfile } = useContext(AuthContext);
  // const { page, setPage } = useContext(PageContext);

  const { setPage } = useContext(PageContext);
  const [stream, setStream] = useState(null);
  const [time, setTime] = useState(5);

  useEffect(() => {
    if (time === 0) goHome();
  }, [time]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time => time - 1);
    }, 1000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    const filteredStreams = streams.filter(str => str.id === match.params.id);
    setPage(null);
    filteredStreams[0]
      ? setStream(filteredStreams[0])
      : fetchSingleStream(match.params.id, setStream);
  }, []);

  const goHome = () => {
    // setCurrentPage(page);
    setPage(1);
    myHistory.push(`/`);
  };

  return (
    <div className="single-stream">
      {stream && currentUserProfile ? (
        <Stream stream={stream} user={currentUserProfile} key={stream.id} />
      ) : (
        <div className="empty-feed">
          Looks like this event isn't available anymore! Redirecting in {time}{" "}
          seconds...
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    streams: state.streams
  };
};

export default connect(mapStateToProps, { fetchSingleStream })(SingleStream);