import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { ReactSVG } from "react-svg";

import { AuthContext } from "../../../providers/Auth";

import { fetchStrangerProfile } from "../../../actions";

import FollowBtn from "../../followBtn";
import { getLanguageName } from "../../../utils/languages";

const Stranger = ({ match, strangerProfile, fetchStrangerProfile }) => {
  const { currentUserProfile } = useContext(AuthContext);

  useEffect(() => {
    if (match.params.id) fetchStrangerProfile(match.params.id);
  }, [match.params.id]);

  return !strangerProfile ? null : (
    <div className="stranger">
      <div className="stranger__header">
        <div>
          <img
            className="stranger__header-img"
            src={
              (strangerProfile && strangerProfile.avatar) ||
              "../../imgs/logo.jpeg"
            }
          />
        </div>
        <div className="stranger__header-body">
          <div className="stranger__header-name">
            {strangerProfile && strangerProfile.name}
          </div>

          <div className="stranger__header-tagline">
            {strangerProfile && strangerProfile.description}
          </div>
          <div className="stranger__header-languages">
            {strangerProfile && strangerProfile.languages
              ? strangerProfile.languages
                  .map((lan) => getLanguageName(lan))
                  .join(", ")
              : null}
          </div>
        </div>

        <div className="stranger__header-social">
          {strangerProfile && strangerProfile.instagram ? (
            <div className="social__icon--instagram">
              <a href={"https://" + strangerProfile.instagram} target="_blank">
                <ReactSVG
                  src="./svgs/instagram.svg"
                  wrapper="div"
                  beforeInjection={(svg) => {
                    svg.classList.add("room__icon");
                  }}
                />
              </a>
            </div>
          ) : null}

          {strangerProfile && strangerProfile.twitter ? (
            <div className="social__icon--twitter">
              <a href={"https://" + strangerProfile.twitter} target="_blank">
                <svg className="social__icon social__icon--twitter-icon">
                  <use xlinkHref="../sprite.svg#twitter"></use>
                </svg>
              </a>
            </div>
          ) : null}

          {strangerProfile && strangerProfile.facebook ? (
            <div className="social__icon--facebook">
              <a href={"https://" + strangerProfile.facebook} target="_blank">
                <svg className="social__icon social__icon--facebook-icon">
                  <use xlinkHref="../sprite.svg#facebook"></use>
                </svg>
              </a>
            </div>
          ) : null}

          {strangerProfile && strangerProfile.soundcloud ? (
            <div className="social__icon--soundcloud">
              <a href={"https://" + strangerProfile.soundcloud} target="_blank">
                <svg className="social__icon social__icon--soundcloud-icon">
                  <use xlinkHref="../sprite.svg#soundcloud"></use>
                </svg>
              </a>
            </div>
          ) : null}

          {strangerProfile && strangerProfile.spotify ? (
            <div className="social__icon--spotify">
              <a href={"https://" + strangerProfile.spotify} target="_blank">
                <svg className="social__icon social__icon--spotify-icon">
                  <use xlinkHref="../sprite.svg#spotify"></use>
                </svg>
              </a>
            </div>
          ) : null}

          {strangerProfile && strangerProfile.youtube ? (
            <div className="social__icon--youtube">
              <a href={"https://" + strangerProfile.youtube} target="_blank">
                <svg className="social__icon social__icon--youtube-icon">
                  <use xlinkHref="../sprite.svg#youtube"></use>
                </svg>
              </a>
            </div>
          ) : null}

          {strangerProfile && strangerProfile.linkedin ? (
            <div className="social__icon--linkedin">
              <a href={"https://" + strangerProfile.linkedin} target="_blank">
                <svg className="social__icon social__icon--linkedin-icon">
                  <use xlinkHref="../sprite.svg#linkedin"></use>
                </svg>
              </a>
            </div>
          ) : null}

          {strangerProfile && strangerProfile.website ? (
            <div className="social__icon--website">
              <a href={"https://" + strangerProfile.website} target="_blank">
                <svg className="social__icon social__icon--website-icon">
                  <use xlinkHref="../sprite.svg#website"></use>
                </svg>
              </a>
            </div>
          ) : null}
        </div>
      </div>

      {/* {!strangerPast.length &&
      !strangerUpcoming.length &&
      !strangerLive.length ? (
        <div className="empty-feed small-margin-top centered">
          Nothing to see here
        </div>
      ) : null} */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    strangerProfile: state.strangerProfile,
  };
};

export default connect(mapStateToProps, {
  fetchStrangerProfile,
})(Stranger);
