import React from "react";
import Iframe from "react-iframe";

const Youtube = ({ ID }) => {
  return (
    <Iframe
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${ID}`}
      frameborder="0"
      allow="fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      className="my-iframe"
    />
  );
};

export default Youtube;

