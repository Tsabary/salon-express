import "./styles.scss";
import React from "react";
import Iframe from "react-iframe";

const TermsAndConditions = () => {
  return (
    <div className="privacy">
      <div>
        By using our site you agree to the Terms and Coditions bellow, and to
        the Terms and conditions of the compeny "8×8", who provides the video
        conference.
      </div>
      <a href="https://jitsi.org/meet-jit-si-terms-of-service/" target="_blank">
        To read "8×8" Terms and Conditions click here
      </a>

      <Iframe
        url="http://localhost:3000/s.html"
        width="100%"
        height="500px"
        id="myId"
        display="initial"
        position="relative"
        className="single-room__chat"
      />
    </div>
  );
};

export default TermsAndConditions;
