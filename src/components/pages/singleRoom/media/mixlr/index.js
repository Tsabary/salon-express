import React from "react";
import { isMobile } from "react-device-detect";
import Iframe from "react-iframe";

const Mixlr = ({ ID }) => {
  return (
    <div
      className={
        isMobile
          ? "media__mixlr--mobile"
          : "media__mixlr--not-mobile"
      }
    >
      <div className="media__no-mobile small-margin-bottom">
        Please listen to the music using a headset, or disable your microphone
        in the chat to prevent noise for the other participants
      </div>

      <Iframe
        url={`https://mixlr.com/users/${ID}/embed?autoplay=true`}
        width="100%"
        height="180px"
        id="myId2"
        display="initial"
        position="relative"
        className="iframe"
      />
    </div>
  );
};

export default Mixlr;
