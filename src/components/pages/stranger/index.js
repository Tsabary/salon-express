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

  return !strangerProfile ? null :(
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
          <div className="max-max">
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
            {strangerProfile && strangerProfile.tagline}
          </div>

          <div className="stranger__header-mentees">
            {/* {strangerProfile && !strangerProfile.followers
              ? null
              : strangerProfile &&  strangerProfile.followers.length === 1
              ? "1 mentee"
              : strangerProfile.followers.length + "mentees"} */}
          </div>
        </div>

        {currentUserProfile ? (
          <FollowBtn
            currentUserProfile={currentUserProfile}
            strangerID={strangerProfile.uid}
            textFollow="Follow"
            textUnfollow="Unfollow"
          
          />
        ) : <div/>}

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

          {strangerProfile && strangerProfile.website ? (
            <div className="social__icon--web">
              <a href={"https://" + strangerProfile.website} target="_blank">
                <svg className="social__icon social__icon--web-icon">
                  <use xlinkHref="../sprite.svg#web"></use>
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
            `Live Streams by ${strangerProfile.name}`,
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
            `Coming Up Streams by ${strangerProfile.name}`,
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
            `Past Streams by ${strangerProfile.name}`,
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

//////////////////language choice and filrter/////////////////
