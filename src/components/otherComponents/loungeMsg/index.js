import "./styles.scss";
import React, { useContext } from "react";
import { AuthContext } from "../../../providers/Auth";
import { UniqueIdContext } from "../../../providers/UniqueId";
import Moment from "react-moment";

const LoungeMessage = ({ message }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { uniqueId } = useContext(UniqueIdContext);

  return (
    <div
      className={
        message.user_ID === uniqueId ||
        (currentUserProfile && message.user_ID === currentUserProfile.uid)
          ? "lounge__msg lounge__msg--me"
          : "lounge__msg lounge__msg--host"
      }
    >
      <Moment className="lounge__msg-time" fromNow>
        {message.created_on.toDate()}
      </Moment>
      <div
        className={
          message.user_ID === uniqueId ||
          (currentUserProfile && message.user_ID === currentUserProfile.uid)
            ? "lounge__msg--me-container"
            : "lounge__msg--host-container"
        }
      >
        {message.message}
      </div>
    </div>
  );
};

export default LoungeMessage;
