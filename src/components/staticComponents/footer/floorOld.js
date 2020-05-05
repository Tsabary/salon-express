import "./styles.scss";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { isMobile } from "react-device-detect";

import history from "../../../history";

import firebase from "firebase/app";

// import tnc from "../../files/tnc.pdf";
// import pp from "../../files/pp.pdf";

const Footer = () => {
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
    <div className="footer">
      <div className="footer__floor">
        <div
          className="footer__floor-powered-container"
          onClick={() => myHistory.push(`/`)}
        >
          <div className="footer__floor-powered-powered">Powered by</div>
          <div className="footer__floor-powered-salon">Salon.</div>
        </div>
        <div className="footer__floor-hashtags">
          <div className="footer__floor-hashtag">#inqlusiv</div>
          <div className="footer__floor-hashtag">#salonXPRS</div>
        </div>
      </div>
    </div>
  );
};

export default connect(null)(Footer);
