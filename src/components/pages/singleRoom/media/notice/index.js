import "./styles.scss";
import React from "react";

const Notice = ({ text, currentAudioChannel }) => {
  return (
    <div className="notice media__no-mobile section__container">
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
