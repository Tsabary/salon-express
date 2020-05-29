import './styles.scss';
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import Moment from "react-moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ReactSVG } from "react-svg";
import ShowMoreText from "react-show-more-text";

import history from "../../../history";
import firebase from "firebase/app";

import { SearchContext } from "../../../providers/Search";
import { PageContext } from "../../../providers/Page";

import { getLanguageName } from "../../../utils/languages";
import { capitalizeSentances } from "../../../utils/strings";
import { AuthContext } from "../../../providers/Auth";

import {
  addToFloorMembers,
  removeFromFloorMembers,
} from "../../../actions/floors";
import { connect } from "react-redux";

const Floor = ({
  floor,
  isForFeed,
  addToFloorMembers,
  removeFromFloorMembers,
}) => {
  const myHistory = useHistory(history);

  const { setSearchTerm } = useContext(SearchContext);
  const { setPage } = useContext(PageContext);
  const { currentUserProfile } = useContext(AuthContext);

  const [shareButton, setShareButton] = useState(null);

  const lastVisit =
    Object.prototype.toString.call(floor.last_visit) === "[object Date]"
      ? floor.last_visit
      : floor.last_visit.toDate();

  const renderTags = () => {
    return floor.tags.map((el) => {
      return (
        <div
          className="room__tag"
          key={el}
          onClick={() => {
            setPage(5);
            setSearchTerm(el);
            firebase.analytics().logEvent("search_from_tag_click");
          }}
        >
          {el}
        </div>
      );
    });
  };

  const shareButtonTimer = () => {
    setTimeout(() => {
      setShareButton(null);
    }, 3000);
  };

  return (
    <div
      className={isForFeed ? "room room-feed clickable" : "room clickable"}
      onClick={() => {
        myHistory.push(`/floor/${floor.url}`);
      }}
    >
      <div className="cover-image__container">
        <img className="cover-image__preview" src={floor.image} />
      </div>
      <div className="room__top">
        <div className="room__content">
          {/* {lastVisit ? (
            <div className="room__last-visit">
              Last visitor joined <Moment fromNow>{lastVisit}</Moment>
            </div>
          ) : null} */}

          <div className="room__title clickable">
            {capitalizeSentances(floor.name)}
          </div>

          <div className="floor-tile__rooms-count">{`${Object.keys(floor.rooms).length} Rooms`}</div>

          {floor.language !== "lir" ? (
            <div className="room__languages--base extra-tiny-margin-top">
              Need to know {getLanguageName(floor.language)}
            </div>
          ) : null}
          {floor.description ? (
            <ShowMoreText
              lines={3}
              more="Show more"
              less="Show less"
              anchorClass="room__read-more"
            >
              {floor.description}
            </ShowMoreText>
          ) : null}

          {isForFeed ? null : (
            <div className="room__description">{floor.description}</div>
          )}

          <div className="tiny-margin-top"> {renderTags()}</div>
        </div>
      </div>
      <div className="room__actions--all">
        {/* <div className="room__actions--pair"> */}
        <CopyToClipboard
          text={`https://salon.express/floor/${floor.url}`}
          data-tip
          data-for={`share${floor.id}`}
          onCopy={() => {
            shareButtonTimer();
            setShareButton("Share URL copied!");
            firebase.analytics().logEvent("floor_share_link_copied");
          }}
        >
          <div className="room__button room__button-line room__button-line--unactive clickable">
            {shareButton ? (
              shareButton
            ) : (
              <ReactSVG
                src={isForFeed ? "./svgs/share.svg" : "../svgs/share.svg"}
                wrapper="div"
                beforeInjection={(svg) => {
                  svg.classList.add("svg-icon--normal");
                }}
              />
            )}
          </div>
        </CopyToClipboard>

        {/* {!currentUserProfile || !currentUserProfile.uid ? (
            <a
              onClick={() => {
                firebase.analytics().logEvent("favorites_clicked_not_user");
              }}
              className="room__button room__button-line room__button-line--unactive clickable"
              href={"#sign-up"}
            >
              <div className="centered-text">Join</div>
            </a>
          ) : floor.members &&
            floor.members.includes(currentUserProfile.uid) ? (
            <div
              className="room__button room__button-line room__button-line--active clickable"
              onClick={() => removeFromFloorMembers(currentUserProfile, floor)}
            >
              <div className="centered-text">Leave</div>
            </div>
          ) : (
            <div
              className="room__button room__button-line room__button-line--unactive clickable"
              onClick={() => addToFloorMembers(currentUserProfile, floor)}
            >
              <div className="centered-text">Join</div>
            </div>
          )} */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default connect(null, { addToFloorMembers, removeFromFloorMembers })(
  Floor
);
