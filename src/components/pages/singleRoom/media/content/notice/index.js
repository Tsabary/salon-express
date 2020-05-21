import "./styles.scss";
import React from "react";

const Notice = ({ text, className, currentAudioChannel }) => {
  return (
    <div className={className ? `notice ${className}`: "notice"}>
      <div>{text}</div>
      {currentAudioChannel && currentAudioChannel.source === "mixlr" ? (
        <div className="notice__mixlr">
          Click the "Click to Play" button below to hear the music
        </div>
      ) : null}
    </div>
  );
};

export default Notice;
