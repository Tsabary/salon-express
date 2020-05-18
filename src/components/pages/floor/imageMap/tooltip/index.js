import "./styles.scss";
import React from "react";
import Iframe from "react-iframe";
import Mixlr from "../../../singleRoom/media/content/mixlr";

const Tooltip = ({ location, room }) => {
  const getPreview = (channel) => {
    switch (true) {
      case channel.source === "twitch":
        return (
          <Iframe
            width="100%"
            height="180px"
            src={`https://player.twitch.tv/?channel=${channel.link}`}
            frameborder="0"
            allow="fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            styles={{ overflowX: "none" }}
            className="my-iframe__content"
          />
        );

      case channel.source === "youtube":
        return (
          <Iframe
            width="100%"
            height="180px"
            src={`https://www.youtube.com/embed/${channel.link}?autoplay=true`}
            frameborder="0"
            allow="fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            styles={{ overflowX: "none" }}
            className="my-iframe__content"
          />
        );

      case channel.source === "mixlr":
        return <Mixlr ID={channel.link} />;

      case channel.source === "website":
        return (
          <Iframe
            width="100%"
            height="180px"
            src={channel.link}
            frameborder="0"
            allow="fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            styles={{ overflowX: "none" }}
            className="my-iframe__content"
          />
        );

      default:
        return room.image ? (
          <div className="room__cover-img">
            <img src={room.image} alt="Room" />
          </div>
        ) : null;
    }
  };

  return (
    <div className="map-tooltip" style={location}>
      <div className="map-tooltip__top">
        {room.active_channel ? getPreview(room.active_channel) : null}
      </div>
      <div className="map-tooltip__body">
        <div className="map-tooltip__name">{room.name}</div>
        <div className="map-tooltip__description tiny-margin-top">
          {room.description}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
//link source title
