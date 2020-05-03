import "./styles.scss";
import React from "react";
import Iframe from "react-iframe";

const TermsAndConditions = () => {
  return (
    <div className="privacy">
      <div>Last updated: May 2nd, 2020</div>

      <div>
        <div>
          By using our site you agree to the Terms and Coditions bellow, and to
          the Terms and conditions of the compeny "8×8", who provides the video
          conference.
        </div>
        <a
          href="https://jitsi.org/meet-jit-si-terms-of-service/"
          target="_blank"
          rel="noopener noreferrer"
        >
          To read "8×8" Terms and Conditions click here
        </a>
      </div>

      <div className="tiny-margin-top">
        <div>
          If you are streaming content using one of the providers we allow on
          Salon.express, you must comply to the terms and conditions of that
          provider. Any violations of those terms would be settled between the
          prosecuter, the streamer and the stream provider.
        </div>

        <div className="extra-tiny-margin-top">
          <a
            href="https://www.twitch.tv/p/legal/terms-of-service/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitch terms and conditions
          </a>
        </div>
        <div className="extra-tiny-margin-top">
          <a
            href="https://www.youtube.com/static?template=terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Youtube terms and conditions
          </a>
        </div>
        <div className="extra-tiny-margin-top">
          <a
            href="https://mixlr.com/terms-of-use/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mixlr terms and conditions
          </a>
        </div>
      </div>

      <div className="small-margin-top">
        <Iframe
          url="http://localhost:3000/terms.html"
          width="100%"
          height="500px"
          id="myId"
          display="initial"
          position="relative"
          className="my-iframe"
        />
      </div>
    </div>
  );
};

export default TermsAndConditions;
