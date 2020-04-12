import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import history from "../../../history";

import { AuthContext } from "../../../providers/Auth";
import { PageContext } from "../../../providers/Page";

import { fetchSingleStream } from "../../../actions";
import Stream from "../../stream";

const SingleStream = ({ match, fetchSingleStream }) => {
  const myHistory = useHistory(history);

  const { currentUserProfile } = useContext(AuthContext);
  const { setPage } = useContext(PageContext);

  const [stream, setStream] = useState(null);
  // const [time, setTime] = useState(5);

  useEffect(() => {
    fetchSingleStream(match.params.id, setStream);
  }, []);

  const renderContent = (stream, currentUserProfile) => {
    switch (true) {
      case !stream:
        return null;

      case stream === "empty":
        return (
          <div className="empty-feed">
            Looks like this event isn't available anymore!
          </div>
        );

      default:
        return (
          <Stream
            stream={stream}
            currentUserProfile={
              currentUserProfile || { uid: "", following: [], followers: [] }
            }
            key={stream.id}
          />
        );
    }
  };

  return (
    <div className="single-stream">
      {renderContent(stream, currentUserProfile)}

      {/* {stream ? (
        <Stream
          stream={stream}
          user={currentUserProfile || { uid: "", following: [], followers: [] }}
          key={stream.id}
        />
      ) : (
        <div className="empty-feed">
          Looks like this event isn't available anymore!
        </div>
      )} */}
    </div>
  );
};

export default connect(null, { fetchSingleStream })(SingleStream);
