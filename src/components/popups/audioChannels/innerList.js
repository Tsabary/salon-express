import React from "react";
import SingleChannel from "./singleChannel";

export default class InnerList extends React.Component {
  shouldComponentUpdate(nextProps) {
      if (nextProps.channels === this.props.channels) {
      return false;
      }
    return true;
  }

  render() {
      return this.props.channels.map((channel, index) => {
        console.log("myyyyy channel", channel)

      return (
        <SingleChannel
          channel={channel}
          room={this.props.room}
          roomIndex={this.props.roomIndex}
          floor={this.props.floor}
          key={channel.id}
          index={index}
        />
      );
    });
  }
}
