import React from 'react';

export const getIframeUrl = (audioChannel) => {
  switch (audioChannel.source) {
    case "youtube":
      return `https://www.youtube.com/embed/${audioChannel.link}?autoplay=true`;

    case "twitch":
      return `https://player.twitch.tv/?channel=${audioChannel.link}`;

    case "mixcloud":
      return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2F${audioChannel.link}`;

    case "mixlr":
      return `https://mixlr.com/users/${audioChannel.link}/embed?autoplay=true`;

    default:
      return `https://${audioChannel.link}`;
  }
};

export const getIframeHeight = (audioChannel) => {
  switch (audioChannel.source) {
    case "youtube":
      return 450;

    case "twitch":
      return 450;

    case "mixcloud":
      return 120;

    case "mixlr":
      return 180;

    default:
      return 450;
  }
};

export const renderControllers = (isChatVisible, setIsChatVisible, isVideoVisible, setIsVideoVisible) => {
  return (
    <div className="content__buttons">
      {isChatVisible ? (
        <div
          className="content__button content__button--active"
          onClick={() => setIsChatVisible(false)}
        >
          Chat
        </div>
      ) : (
        <div
          className="content__button content__button--unactive"
          onClick={() => setIsChatVisible(true)}
        >
          Chat
        </div>
      )}

      {isVideoVisible ? (
        <div
          className="content__button content__button--active"
          onClick={() => setIsVideoVisible(false)}
        >
          Stream
        </div>
      ) : (
        <div
          className="content__button content__button--unactive"
          onClick={() => setIsVideoVisible(true)}
        >
          Stream
        </div>
      )}
    </div>
  );
};
