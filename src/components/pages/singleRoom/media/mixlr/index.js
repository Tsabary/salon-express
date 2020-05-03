import React from "react";
import { isMobile } from "react-device-detect";
import Iframe from "react-iframe";

import Notice from "../notice";

const Mixlr = ({ ID }) => {
  return (
    <div
      className={isMobile ? "media__mixlr--mobile" : "media__mixlr--not-mobile"}
    >
      {/* {!isMobile ? (
        <div className="media__no-mobile">
          <Notice
            text="
          Please listen to the music using a headset, or disable your microphone
          in the chat to prevent noise for the other participants"
          />
        </div>
      ) : null} */}

      <Iframe
        url={`https://mixlr.com/users/${ID}/embed?autoplay=true`}
        width="100%"
        height="180px"
        id="myId2"
        display="initial"
        position="relative"
        className="my-iframe"
      />
    </div>
  );
};

export default Mixlr;