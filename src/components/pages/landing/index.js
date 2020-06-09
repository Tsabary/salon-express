import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../providers/Auth";
import CopyIframeCode from "../../otherComponents/copyIframeCode";

import SignUpForm from "../../forms/signUpForm";
import { ReactSVG } from "react-svg";

const Landing = () => {
  const { currentUserProfile } = useContext(AuthContext);

  const features = [
    {
      title: "Professional Marketplace",
      body:
        "Get your studio discovered by customers in our professionals marketplace.",
      svg: "marketplace",
    },
    {
      title: "Advanced Video Chat",
      body:
        "Your video meetings could be broken down into separate chat groups if needed.",
      svg: "video",
    },
    {
      title: "Live External Content Sharing",
      body:
        "Share external websites and videos with your customers, in your studio, in real time.",
      svg: "sharing",
    },
    {
      title: "Events for Creators",
      body:
        "Add events to your calendar and host them in your studio. We will share your event with all of our users.",
      svg: "events",
    },
  ];

  const renderFeatures = (feats) => {
    return feats.map((ft) => {
      return (
        <div className="landing__features-feature">
          <div className="landing__features-feature-container">
            <ReactSVG
              src={`../landing/${ft.svg}.svg`}
              wrapper="div"
              beforeInjection={(svg) => {
                svg.classList.add("svg-icon--60");
              }}
            />
            <div className="landing__features-title small-margin-top">
              {ft.title}
            </div>
            <div className="landing__features-subtitle">{ft.body}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="landing">
      <div className="landing__body ">
        <div
          className="landing__body--top fr-fr section__container"
          style={{ gap: "5rem" }}
        >
          <div>
            <div className="tiny-margin-left">
              <h1>Turn your personal website into your virtual studio</h1>
              <h2 className="tiny-margin-top">
                Stop wasting time on emails and increase your
                <br />
                chances of turning visitors to customers.
              </h2>
            </div>

            <div className="small-margin-top">
              {currentUserProfile ? (
                <div className="section__container">
                  <div className="main-color">
                    Paste this code in your website wherever you'd like your
                    studio to be. We recommend that you use a full page for
                    that.
                  </div>
                  <CopyIframeCode profile={currentUserProfile} />
                </div>
              ) : (
                <SignUpForm />
              )}
            </div>
          </div>

          <img src="../landing/vc.png" alt="video conference" />
        </div>

        <div className="section__container">
          <div className="centered-text small-margin-top">
            <h1 className="landing__title">What We Do For Individuals</h1>
            <h2 className="landing__subitle tiny-margin-top">
              We build professional tools that help you communicate with new
              customers, so you can focus more on what you do best.
            </h2>
          </div>

          <div
            className="landing__features medium-margin-top"
            style={{ gap: "5rem", padding: "5rem" }}
          >
            {renderFeatures(features)}
          </div>
        </div>

        <div
          className="fr-fr section__container tiny-margin-bottom"
          style={{ gap: "5rem", padding: "8rem" }}
        >
          <div>
            <h1>
              {!currentUserProfile
                ? "Create your account now."
                : "Embed your office now."}
              <br />
              It's FREE!
            </h1>
            <ul className="small-margin-top">
              <li>Set your office hours.</li>
              <li>Visitors need to knock to be let in your studio.</li>
              <li>Connect other platforms to showcase your work.</li>
            </ul>
          </div>
          <div className="small-margin-top centered">
            {currentUserProfile ? (
              <div className="section__container">
                <div className="main-color">
                  Paste this code in your website wherever you'd like your
                  studio to be. We recommend that you use a full page for that.
                </div>
                <CopyIframeCode profile={currentUserProfile} />
              </div>
            ) : (
              <SignUpForm />
            )}
          </div>
        </div>

        {/* <div className="section__container fr-fr">
          <div>
            <div className="landing__features-subtitle">
              Get a notified when someone is at your studio and wants to talk
            </div>
            <div className="landing__features-subtitle">
              If you are free, let them in and start the meeting. If not, they
              can leave you a message.
            </div>
          </div>
          <div>Ahhhh</div>
        </div>

        <div className="section__container small-margin-bottom">Pricing</div> */}
      </div>
    </div>
  );
};

export default Landing;
