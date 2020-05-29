import "./styles.scss";
import React, { useContext } from "react";
import { ReactSVG } from "react-svg";

import firebase from "../../../firebase";

import { AuthContext } from "../../../providers/Auth";
import { GlobalContext } from "../../../providers/Global";

const Pricing = () => {
  const { currentUserProfile } = useContext(AuthContext);
  const { setUpgradePlan } = useContext(GlobalContext);

  //   const freeForAllFeatures = [
  //     "Join and open public Rooms, private Rooms & public Floors",
  //     "Join private Floors",
  //     "Unlimited external channels, calendar events and portals per Room",
  //   ];

  //   const freeFeatures = [...freeForAllFeatures, "5 admins per Room"];

  //   const teamFeatures = [
  //     // ...freeForAllFeatures,
  //     "10 admins per Room",
  //     "No advertisements",
  //     "1 private Floor",
  //     "10 Rooms per private Floor",
  //   ];

  //   const enterpriseFeatures = [
  //     // ...freeForAllFeatures,
  //     "Unlimited admins per Room",
  //     "No advertisements",
  //     "3 private Floors",
  //     "Unlimited Rooms per private Floor",
  //   ];


  const free = [
    "Unlimited external channels, calendar events and portals per Room",
    "5 admins per Room",
  ];
  const lvl1 = [
    "Unlimited external channels, calendar events and portals per Room",
    "Unlimited admins per Room",
    "No advertisements in Floor",
    "1 Floor",
    "10 Rooms per Floor",
  ];
  const lvl2 = [
    "Unlimited external channels, calendar events and portals per Room",
    "Unlimited admins per Room",
    "No advertisements in Floor",
    "1 Floor",
    "Unlimited Rooms per Floor",
  ];
  const lvl3 = [
    "Unlimited external channels, calendar events and portals per Room",
    "Unlimited admins per Room",
    "No advertisements in Floor",
    "3 Floor",
    "Unlimited Rooms per Floor",
  ];

  const handleClick = (plan) => {
    setUpgradePlan(plan);
    window.location.hash = "premium-plan";
  };

  const renderFeatures = (ftrs, border) => {
    return ftrs.map((ft, i) => {
      return (
        <div>
          <div className="max-fr">
            <ReactSVG
              src="../../svgs/check.svg"
              wrapper="div"
              beforeInjection={(svg) => {
                svg.classList.add("svg-icon--normal");
              }}
            />
            <div className="feature">{ft}</div>
          </div>
          <div
            className={
              i === ftrs.length - 1 && border
                ? "feature__border--regular"
                : "feature__border--regular"
            }
          />
        </div>
      );
    });
  };

  return (
    <div className="pricing">
      <div className="section__container centered-text">
        <h1>Premium Plans</h1>
        <h2>
          Salon Express gives you access to ulimited amount of private & public
          Rooms and public Floors for FREE. Upgrade to one of our premium plans to
          bring the hype to your organization and open a private Floor just for you.
        </h2>
      </div>

      <div className="pricing__plans tiny-margin-top">
        <div className="pricing__plan section__container">
          <div className="medium-margin-bottom">
            <div className="pricing__title tiny-margin-bottom">Enterprise</div>
            <div className="pricing__plan-price">
              <div className="pricing__plan-price-sides">$</div>
              <div className="pricing__plan-price-value">14</div>
              <div className="pricing__plan-price-sides">.99</div>

              <div
                className="pricing__plan-price-sides"
                style={{ alignSelf: "end" }}
              >
                /month
              </div>
            </div>
            <div className="tiny-margin-top">{renderFeatures(lvl3)}</div>
          </div>
          <div
            className="small-button"
            onClick={() => {
              handleClick("enterprise");

              firebase
                .analytics()
                .logEvent("plans_purchase_clicked", { plan: "enterprise" });
            }}
          >
            Upgrade to Enterprise
          </div>
        </div>

        <div className="pricing__plan section__container">
          <div className="medium-margin-bottom">
            <div className="pricing__title tiny-margin-bottom">Scale</div>
            <div className="pricing__plan-price">
              <div className="pricing__plan-price-sides">$</div>
              <div className="pricing__plan-price-value">11</div>
              <div className="pricing__plan-price-sides">.99</div>

              <div
                className="pricing__plan-price-sides"
                style={{ alignSelf: "end" }}
              >
                /month
              </div>
            </div>
            <div className="tiny-margin-top">{renderFeatures(lvl2)}</div>
          </div>
          <div
            className="small-button"
            onClick={() => {
              handleClick("scale");

              firebase
                .analytics()
                .logEvent("plans_purchase_clicked", { plan: "scale" });
            }}
          >
            Upgrade to Scale
          </div>
        </div>

        <div className="pricing__plan section__container">
          <div className="medium-margin-bottom">
            <div className="fr-max tiny-margin-bottom">
              <div className="pricing__title">Team</div>
              <div className="max-max">
                <ReactSVG
                  src="../../svgs/round_lightning.svg"
                  wrapper="div"
                  beforeInjection={(svg) => {
                    svg.classList.add("svg-icon--big");
                  }}
                />
                <div className="pricing__popular">Most Popular</div>
              </div>
            </div>

            <div className="pricing__plan-price">
              <div className="pricing__plan-price-sides">$</div>
              <div className="pricing__plan-price-value">8</div>
              <div className="pricing__plan-price-sides">.99</div>

              <div
                className="pricing__plan-price-sides"
                style={{ alignSelf: "end" }}
              >
                /month
              </div>
            </div>
            <div className="tiny-margin-top">{renderFeatures(lvl1)}</div>
          </div>
          <div
            className="small-button"
            onClick={() => {
              handleClick("team");
              firebase
                .analytics()
                .logEvent("plans_purchase_clicked", { plan: "team" });
            }}
          >
            Upgrade to Team
          </div>
        </div>

        <div className="pricing__plan section__container">
          <div className="medium-margin-bottom">
            <div className="pricing__title tiny-margin-bottom">Solo</div>
            <div className="pricing__plan-price-value">FREE</div>

            <div className="tiny-margin-top">{renderFeatures(free)}</div>
          </div>
          {currentUserProfile ? (
            <div className="small-button small-button--disabled">
              Your current plan
            </div>
          ) : (
            <div
              className="small-button"
              onClick={() => {
                window.location.hash = "sign-up";
                firebase
                  .analytics()
                  .logEvent("plans_purchase_clicked", { plan: "free" });
              }}
            >
              Sign Up | Login
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
