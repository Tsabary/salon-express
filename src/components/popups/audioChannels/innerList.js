import React from "react";
import SingleChannel from "./singleChannel";

export default class InnerList extends React.Component {
  shouldComponentUpdate(nextProps) {
      if (nextProps.channels === this.props.channels) {
        console.log("myyyyy", "they're the same")

      return false;
      }
      console.log("myyyyy", "they're different")

    return true;
  }

  render() {
      return this.props.channels.map((channel, index) => {
        console.log("myyyyy channel", channel)

      return (
        <SingleChannel
          channel={channel}
          room={this.props.room}
          key={channel.id}
          index={index}
        />
      );
    });
  }
}
