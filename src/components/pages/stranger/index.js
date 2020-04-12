import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../providers/Auth";

import { renderSection } from "../../../utils/feeds";

import {
  fetchStrangerProfile,
  fetchFirstStrangerLive,
  fetchMoreStrangerLive,
  fetchFirstStrangerUpcoming,
  fetchMoreStrangerUpcoming,
  fetchFirstStrangerPast,
  fetchMoreStrangerPast,
} from "../../../actions";

import FollowBtn from "../../followBtn";
import { getLanguageName } from "../../../utils/languages";

const Stranger = ({
  match,
  strangerLive,
  strangerUpcoming,
  strangerPast,
  strangerProfile,
  fetchFirstStrangerLive,
  fetchMoreStrangerLive,
  fetchFirstStrangerUpcoming,
  fetchMoreStrangerUpcoming,
  fetchFirstStrangerPast,
  fetchMoreStrangerPast,
  fetchStrangerProfile,
}) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [lastVisibleLive, setLastVisibleLive] = useState(null);
  const [reachedLastLive, setReachedLastLive] = useState(true);

  const [lastVisibleUpcoming, setLastVisibleUpcoming] = useState(null);
  const [reachedLastUpcoming, setReachedLastUpcoming] = useState(true);

  const [lastVisiblePast, setLastVisiblePast] = useState(null);
  const [reachedLastPast, setReachedLastPast] = useState(true);

  const dateNow = new Date();

  useEffect(() => {
    if (match.params.id) fetchStrangerProfile(match.params.id);
  }, [match.params.id]);

  useEffect(() => {
    console.log(strangerProfile);
    if (!strangerProfile) return;

    if (strangerProfile.uid && !strangerLive.length) {
      fetchFirstStrangerLive(
        setLastVisibleLive,
        setReachedLastLive,
        dateNow,
        strangerProfile.uid
      );
    }

    if (strangerProfile.uid && !strangerUpcoming.length) {
      fetchFirstStrangerUpcoming(
        setLastVisibleUpcoming,
        setReachedLastUpcoming,
        dateNow,
        strangerProfile.uid
      );
    }

    if (strangerProfile.uid && !strangerPast.length) {
      fetchFirstStrangerPast(
        setLastVisiblePast,
        setReachedLastPast,
        dateNow,
        strangerProfile.uid
      );
    }
  }, [strangerProfile]);

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
          <div className="stranger__header-names">
            <div className="stranger__header-name">
              {strangerProfile && strangerProfile.name}
            </div>
            {strangerProfile &&
            strangerProfile.username !== strangerProfile.uid ? (
              <div className="stranger__header-username">
                A.K.A {strangerProfile && strangerProfile.username}
              </div>
            ) : null}
          </div>
          <div className="stranger__header-tagline">
            {strangerProfile && strangerProfile.description}
          </div>
          <div className="stranger__header-languages">
            {strangerProfile && strangerProfile.languages
              ? `Languages: ${strangerProfile.languages
                  .map((lan) => getLanguageName(lan))
                  .join(", ")}`
              : null}
          </div>
        </div>

        {currentUserProfile &&
        currentUserProfile.uid !== strangerProfile.uid ? (
          <FollowBtn
            currentUserProfile={currentUserProfile}
            strangerID={strangerProfile.uid}
            textFollow="Follow"
            textUnfollow="Unfollow"
          />
        ) : (
          <div />
        )}

        <div className="stranger__header-social">
          {strangerProfile && strangerProfile.instagram ? (
            <div className="social__icon--instagram">
              <a href={"https://" + strangerProfile.instagram} target="_blank">
                <svg className="social__icon social__icon--instagram-icon">
                  <use xlinkHref="../sprite.svg#instagram"></use>
                </svg>
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

      {strangerProfile ? (
        <>
          {renderSection(
            strangerLive,
            `Live Practice Sessions Hosted by ${strangerProfile.name}`,
            fetchMoreStrangerLive,
            lastVisibleLive,
            setLastVisibleLive,
            reachedLastLive,
            setReachedLastLive,
            dateNow,
            currentUserProfile
          )}

          {renderSection(
            strangerUpcoming,
            `Future Practice Sessions Hosted by ${strangerProfile.name}`,
            fetchMoreStrangerUpcoming,
            lastVisibleUpcoming,
            setLastVisibleUpcoming,
            reachedLastUpcoming,
            setReachedLastUpcoming,
            dateNow,
            currentUserProfile
          )}

          {renderSection(
            strangerPast,
            `Practice Sessions Hosted I've Missed with ${strangerProfile.name}`,
            fetchMoreStrangerPast,
            lastVisiblePast,
            setLastVisiblePast,
            reachedLastPast,
            setReachedLastPast,
            dateNow,
            currentUserProfile
          )}
        </>
      ) : null}

      {!strangerPast.length &&
      !strangerUpcoming.length &&
      !strangerLive.length ? (
        <div className="empty-feed small-margin-top centered">
          Nothing to see here
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    strangerLive: state.strangerLive,
    strangerUpcoming: state.strangerUpcoming,
    strangerPast: state.strangerPast,
    strangerProfile: state.strangerProfile,
  };
};

export default connect(mapStateToProps, {
  fetchStrangerProfile,
  fetchFirstStrangerLive,
  fetchMoreStrangerLive,
  fetchFirstStrangerUpcoming,
  fetchMoreStrangerUpcoming,
  fetchFirstStrangerPast,
  fetchMoreStrangerPast,
})(Stranger);
