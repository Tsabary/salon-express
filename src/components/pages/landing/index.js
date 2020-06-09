import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../providers/Auth";
import CopyIframeCode from "../../otherComponents/copyIframeCode";

import SignUpForm from "../../forms/signUpForm";

const Landing = () => {
  const { currentUserProfile } = useContext(AuthContext);

  return (
    <div className="landing">
      <div className="landing__body ">
        <div
          className="landing__body--top fr-fr section__container"
          style={{ gap: "5rem" }}
        >
          <div>
            <h1>
              Turn your personal website <br />
              into a virtual office
            </h1>
            <h2 className="tiny-margin-top">
              Talk face-to-face with visitors of your website and
              <br />
              increase your chances of landing them as your clients.
            </h2>

            <div className="small-margin-top">
              {currentUserProfile ? (
                <CopyIframeCode profile={currentUserProfile} />
              ) : (
                <SignUpForm />
              )}
            </div>
          </div>

          <img src="../static/vc.png" alt="video conference" />
        </div>

        <div className="section__container">
          <div className="centered-text small-margin-top">
            <h1>What We Do For Freelancers</h1>
            <h2>
              We build tools that help you land new clients and communicate with
              <br />
              them, so you can focus more on what you do best.
            </h2>
          </div>

          <div
            className="fr-fr centered-text medium-margin-top"
            style={{ gap: "5rem" }}
          >
            <div>
              <div className="landing__features-title">
                Proffesional Marketplace
              </div>
              <div className="landing__features-subtitle">
                Add your office to our collection of qualified proffesionals and
                be discovered by clients.
              </div>
            </div>
            <div>
              <div className="landing__features-title">Advanced Video Chat</div>
              <div className="landing__features-subtitle">
                Your video meetings could be broken down into different video
                chat groups if needed.
              </div>
            </div>
            <div>
              <div className="landing__features-title">
                Live External Content Sharing
              </div>
              <div className="landing__features-subtitle">
                You and your clients can share with eachother external content
                such as other websites or videos, in your office, live.
              </div>
            </div>
            <div>
              <div className="landing__features-title">
                Calendar for Creators
              </div>
              <div className="landing__features-subtitle">
                Trying to grow your online presence? Add events to your calendar
                and host webinars in your office. We'll share it on our event's
                feed.
              </div>
            </div>
          </div>
        </div>

        <div className="section__container fr-fr">
          <div>
            <div className="landing__features-subtitle">
              Get a notified when someone’s at your office and wants to talk
            </div>
            <div className="landing__features-subtitle">
              If you are free, open the door for them and start the meeting. If
              not, they can leave you a message.
            </div>
          </div>
          <div>Ahhhh</div>
        </div>

        <div className="section__container small-margin-bottom">Pricing</div>
      </div>
    </div>
  );
};

export default Landing;
