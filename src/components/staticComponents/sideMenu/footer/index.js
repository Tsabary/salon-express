import React from "react";

const SidebarFooter = () => {
  return (
    <div className="side-menu__footer">
      <div className="side-menu__footer-links">
      <a href={"https://salon.express/blog"} rel="noopener noreferrer">
          Blog
        </a>
        {" | "}
        <a href={"https://salon.express/pricing"} rel="noopener noreferrer">
          Pricing
        </a>
        {" | "}
        <a
          href={"https://salon.express/floor-management"}
          rel="noopener noreferrer"
        >
          Floor Management
        </a>
        {" | "}
        <a href={"https://salon.express/contact"} rel="noopener noreferrer">
          Contact
        </a>
        {" | "}
        <a
          href={"https://salon.express/privacy-policy"}
          rel="noopener noreferrer"
        >
          Terms and Conditions
        </a>
        {" | "}
        <a
          href={"https://salon.express/terms-and-conditions"}
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default SidebarFooter;
