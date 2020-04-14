import "./styles.scss";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import history from "../../history";

import tnc from "../../documents/tnc.pdf";
import pp from "../../documents/pp.pdf";

const Footer = () => {
  const myHistory = useHistory(history);

  const handleChange = (page, path) => {
    myHistory.push(`/${path}`);
    window.scrollTo(0, 0);
  };

  const renderMenuItems = (items) => {
    return items.map((group) => {
      return (
        <div className="footer__section-contents" key={group.title}>
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
      {/* <div className="footer__section footer__left-cul">
        <div className="footer__logo">Saasketeer</div>
        <div className="footer__rights">All rights reserved</div>
      </div> */}

      {renderMenuItems([
        {
          title: "Pages",
          pages: [
            { title: "Home", path: "" },
            { title: "FAQ", path: "frequently-asked-questions" },
          ],
        },

        {
          title: "Company",
          pages: [
            { title: "Careers", path: "careers" },
            { title: "Contact", path: "contact" },
          ],
        },
      ])}

      <div className="footer__section-contents">
        <div className="footer__section-title">Support</div>
        <a className="footer__section-item" href={pp} target="_blank">
          Privacy Policy
        </a>

        <a className="footer__section-item" href={tnc} target="_blank">
          Terms and Conditions
        </a>
      </div>

      {/* <div className="footer__section-contents">
        <div className="footer__section-title">Stay in touch</div>
        <SocialLinks />
      </div> */}
    </div>
  );
};

export default connect(null)(Footer);
