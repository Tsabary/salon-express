import "./styles.scss";
import React, { useState, useContext } from "react";
import FloorLogo from "../../../staticComponents/header/floorLogo";

import { CopyToClipboard } from "react-copy-to-clipboard";

import firebase from "../../../../firebase";
import { AuthContext } from "../../../../providers/Auth";

import {
  addToFloorMembers,
  removeFromFloorMembers,
} from "../../../../actions/floors";
import { connect } from "react-redux";

const FloorInfo = ({ floor, addToFloorMembers, removeFromFloorMembers }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const [shareButton, setShareButton] = useState("Invite friends +");

  const shareButtonTimer = () => {
    setTimeout(() => {
      setShareButton("Invite friends +");
    }, 3000);
  };

  return floor ? (
    <div className="floor-info fr-max">
      <div>
        <FloorLogo />
        <div className="tiny-margin-top">
          <div className="floor-info__details">
            <div>{floor.private ? "Private Floor" : "Public Floor"}</div>
            <div className="floor-info__seperator" />
            <div>
              {floor.rooms ? Object.keys(floor.rooms).length : "0"} rooms
            </div>
            <div className="floor-info__seperator" />
            <div>{floor.members ? floor.members.length : "0"} members</div>
          </div>
        </div>
      </div>

      <div className="floor-info__actions">
        <CopyToClipboard
          text={`https://salon.express/floor/${floor.url}`}
          onCopy={() => {
            shareButtonTimer();
            setShareButton("Share URL copied!");
            firebase.analytics().logEvent("room_share_link_copied");
          }}
        >
          <div className="small-button">{shareButton}</div>
        </CopyToClipboard>

        {currentUserProfile &&
        floor.members &&
        floor.members.includes(currentUserProfile.uid) ? (
          <div
            className="small-button small-button--disabled"
            onClick={() => removeFromFloorMembers(currentUserProfile, floor)}
          >
            leave Floor
          </div>
        ) : (
          <div
            className="small-button"
            onClick={() => addToFloorMembers(currentUserProfile, floor)}
          >
            join Floor +
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default connect(null, { addToFloorMembers, removeFromFloorMembers })(
  FloorInfo
);
