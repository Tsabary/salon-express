import "./styles.scss";
import React from "react";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";

import history from "../../../history";

const Update = ({ update }) => {
  const myHistory = useHistory(history);

  return (
    <div className="update">
      {update.user_ID ? <span className="update__user clickable"  onClick={() => myHistory.push(`/${update.user_username}`)}>{update.user_name}</span> : "Someone"}
      {" "}has joined{" "}
      <span className="update__room clickable" onClick={() => myHistory.push(`/room/${update.room_ID}`)}>
        {update.room_name}
      </span>
      <div className="fr-max update__timestamp">
        <div />
        <Moment fromNow>{update.created_on}</Moment>
      </div>
    </div>
  );
};

export default Update;
