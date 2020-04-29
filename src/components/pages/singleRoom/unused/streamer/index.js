import "./styles.scss";
import React from "react";
import { connect } from "react-redux";

import flv from "flv.js";
class Streamer extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    this.player = flv.createPlayer({
      type: "flv",
      // url: `https://localhost:8000/live/${this.props.currentAudioChannel}.flv`
      url: `http://localhost:8000/live/44.flv`,
    });

    this.player.attachMediaElement(this.videoRef.current);
    this.player.load();
  }

  render() {
    return (
      <div className="streamer">
        <video ref={this.videoRef} className="streamer__video" controls />
      </div>
    );
  }
}

export default Streamer;
