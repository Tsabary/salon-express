import React from "react";
import Iframe from "react-iframe";

const Twitch = ({ ID }) => {
  return (
    <Iframe
      width="100%"
      height="100%"
      src={`https://player.twitch.tv/?channel=${ID}`}
      frameborder="0"
      allow="fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      className="iframe"
    />
  );
};

export default Twitch;
