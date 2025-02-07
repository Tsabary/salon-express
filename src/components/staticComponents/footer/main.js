import "./styles.scss";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { isMobile } from "react-device-detect";

import history from "../../../history";

import firebase from "firebase/app";

// import tnc from "../../files/tnc.pdf";
// import pp from "../../files/pp.pdf";

const Footer = ({ isFloor }) => {
  const myHistory = useHistory(history);

  const handleChange = (page, path) => {
    firebase.analytics().logEvent("footer_navigation", { page });
    myHistory.push(`/${path}`);
    window.scrollTo(0, 0);
  };

  const renderMenuItems = (items) => {
    return items.map((group) => {
      return (
        <div
          className={
            isMobile
              ? "footer__section-contents footer__mobile"
              : "footer__section-contents"
          }
          key={group.title}
        >
          <div className="footer__section-title">{group.title}</div>
          {group.pages.map((page) => {
            return (
              <div
                className="footer__section-item"
                key={page.title}
                onClick={() => handleChange(page.title, page.path)}
              >
                {page.title}
              </div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="footer big-margin-bottom">
      <div className="footer__container">
        {isFloor ? (
          <div className="footer__section footer__left-cul">
            <div
              className="footer__floor-powered-container"
              onClick={() => myHistory.push(`/`)}
            >
              <div className="footer__floor-powered-powered">Powered by</div>
              <div className="footer__floor-powered-salon">Salon.</div>
            </div>
          </div>
        ) : null}

        {renderMenuItems([
          {
            title: "Pages",
            pages: [
              { title: "Home", path: "" },
              { title: "Blog", path: "blog" },
              { title: "Floor Managment", path: "floor-management" },
            ],
          },

          {
            title: "Company",
            pages: [
              // { title: "Careers", path: "careers" },
              { title: "Contact", path: "contact" },
            ],
          },
        ])}

        <div className="footer__section-contents">
          <div className="footer__section-title">Support</div>
          <div
            className="footer__section-item"
            onClick={() => handleChange("Privacy Policy", "privacy-policy")}
          >
            Privacy Policy
          </div>

          <div
            className="footer__section-item"
            onClick={() =>
              handleChange("Terms and Conditions", "terms-and-conditions")
            }
          >
            Terms and Conditions
          </div>
        </div>

        {/* <div className="footer__section-contents">
        <div className="footer__section-title">Stay in touch</div>
        <SocialLinks />
      </div> */}
      </div>
    </div>
  );
};

export default connect(null)(Footer);
