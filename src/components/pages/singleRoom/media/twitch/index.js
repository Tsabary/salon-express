import React from "react";
import Iframe from "react-iframe";

const Twitch = ({ ID, isVideoVisible }) => {
  return (
    <Iframe
      width="100%"
      height="450px"
      src={`https://player.twitch.tv/?channel=${ID}`}
      frameborder="0"
      allow="fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      className={isVideoVisible ? "my-iframe": "my-iframe my-iframe--invisible"}
    />
  );
};

export default Twitch;
