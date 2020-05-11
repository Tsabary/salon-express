import "./styles.scss";
import React, { useEffect, useState } from "react";

import Updates from "./updates";
import Faq from "./faq";
import { FloorContext } from "../../../providers/Floor";
import { useHistory } from "react-router-dom";
import history from "../../../history";

const BottomHelpers = () => {
  const myHistory = useHistory(history);

  const [isFloor, setIsFloor] = useState(
    window.location.href.includes("floor") &&
      !window.location.href.includes("management") &&
      window.location.href.split("/").length === 5
  );

  useEffect(() => {
    return myHistory.listen((location) => {
      setIsFloor(
        location.pathname.includes("floor") &&
          !location.pathname.includes("management") &&
          location.pathname.split("/").length === 3
      );
    });
  }, [history]);

  return (
    <div className="bottom-helpers">
      <div style={{ position: "relative" }}>
        <div className="bottom-helpers__chats">
          <Faq />
          <Updates />
        </div>
      </div>
      <div>
        {/* {!isFloor ? (
          <div
            className="bottom-helpers__notice clickable"
            onClick={() => myHistory.push("/floor/inqlusiv")}
          >
            <div className="bottom-helpers__notice--title">INQLUSIV</div>
            <div className="bottom-helpers__notice--body extra-tiny-margin-top">
              Looking for INQLUSIV Festival? Click here.
            </div>
          </div>
        ) : null} */}
      </div>
    </div>
  );
};

export default BottomHelpers;
