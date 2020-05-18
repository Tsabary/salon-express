import React from "react";
import { isMobile } from "react-device-detect";
import Iframe from "react-iframe";

const Mixlr = ({ ID }) => {
  return (
    <div
      className={isMobile ? "media__mixlr--mobile" : "media__mixlr--not-mobile"}
    >
      <Iframe
        url={`https://mixlr.com/users/${ID}/embed?autoplay=true`}
        width="100%"
        height="180px"
        id="myId2"
        display="initial"
        position="relative"
        className="my-iframe my-iframe--mixlr"
      />
    </div>
  );
};

export default Mixlr;
