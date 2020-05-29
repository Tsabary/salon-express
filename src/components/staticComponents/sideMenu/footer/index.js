import React, { useContext } from "react";
import { GlobalContext } from "../../../../providers/Global";

const SidebarFooter = () => {
  const { setIsMenuOpen } = useContext(GlobalContext);

  return (
    <div className="side-menu__footer">
      <div className="side-menu__footer-links">
        <a
          href={"https://salon.express/blog"}
          rel="noopener noreferrer"
          onClick={() => setIsMenuOpen(false)}
        >
          Blog
        </a>
        {" | "}
        <a
          href={"https://salon.express/pricing"}
          rel="noopener noreferrer"
          onClick={() => setIsMenuOpen(false)}
        >
          Pricing
        </a>
        {" | "}
        <a
          href={"https://salon.express/floor-management"}
          rel="noopener noreferrer"
          onClick={() => setIsMenuOpen(false)}
        >
          Floor Management
        </a>
        {" | "}
        <a
          href={"https://salon.express/contact"}
          rel="noopener noreferrer"
          onClick={() => setIsMenuOpen(false)}
        >
          Contact
        </a>
        <br />
        <a
          href={"https://salon.express/privacy-policy"}
          rel="noopener noreferrer"
          onClick={() => setIsMenuOpen(false)}
        >
          Privacy Policy
        </a>
        {" | "}
        <a
          href={"https://salon.express/terms-and-conditions"}
          rel="noopener noreferrer"
          onClick={() => setIsMenuOpen(false)}
        >
          Terms and Conditions
        </a>
      </div>
    </div>
  );
};

export default SidebarFooter;
