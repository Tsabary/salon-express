import "./styles.scss";
import React, { useState, useContext, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import history from "../../../history";
import { AuthContext } from "../../../providers/Auth";
import { navigateToFirstRoom } from "../../../actions/rooms";
import { titleToUrl } from "../../../utils/strings";

import One from "./one";
import Two from "./two";
import { UniqueIdContext } from "../../../providers/UniqueId";

const OnBoarding = ({ navigateToFirstRoom }) => {
  const myHistory = useHistory(history);
  const { currentUserProfile } = useContext(AuthContext);
  const { isFirstVisit, setIsFirstVisit } = useContext(UniqueIdContext);

  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!currentUserProfile || !isFirstVisit) return;
    navigateToFirstRoom(currentUserProfile.uid, (room) => {
      myHistory.push(`/room/${titleToUrl(room.name)}-${room.id}`);
      setIsFirstVisit(false);
    });
  }, [currentUserProfile]);

  const renderContent = (p) => {
    switch (p) {
      case 0:
        return <One />;

      case 1:
        return <Two />;
    }
  };

  return isFirstVisit ? (
    <div className="on-boarding">
      <div className="modal-window">
        <div className="modal-window__content">
          <div className="popup__close">
            <div />
            <div
              className="popup__close-text"
              onClick={() => {
                setIsFirstVisit(false);
              }}
            >
              Close
            </div>
          </div>
          {renderContent(page)}
          {page === 0 ? (
            <div
              className="small-button centered tiny-margin-top"
              onClick={() => setPage(page + 1)}
            >
              Next
            </div>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;
};

export default connect(null, { navigateToFirstRoom })(OnBoarding);
