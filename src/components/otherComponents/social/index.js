import "./styles.scss";
import React from "react";

import { ReactSVG } from "react-svg";

const Social = ({ data }) => {
  return (
    <div className="social">
      {data.instagram ? (
        <a
          href={"https://" + data.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ReactSVG
            src="../svgs/instagram.svg"
            wrapper="div"
            beforeInjection={(svg) => {
              svg.classList.add("social__icon");
            }}
          />
        </a>
      ) : null}

      {data.twitch ? (
        <a
          href={"https://" + data.twitch}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ReactSVG
            src="../svgs/twitch.svg"
            wrapper="div"
            beforeInjection={(svg) => {
              svg.classList.add("social__icon");
            }}
          />
        </a>
      ) : null}

      {data.twitter ? (
        <div className="social__icon--twitter">
          <a
            href={"https://" + data.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ReactSVG
              src="../svgs/twitter.svg"
              wrapper="div"
              beforeInjection={(svg) => {
                svg.classList.add("social__icon");
              }}
            />
          </a>
        </div>
      ) : null}

      {data.facebook ? (
        <a
          href={"https://" + data.facebook}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ReactSVG
            src="../svgs/facebook.svg"
            wrapper="div"
            beforeInjection={(svg) => {
              svg.classList.add("social__icon");
            }}
          />
        </a>
      ) : null}

      {data.soundcloud ? (
        <a
          href={"https://" + data.soundcloud}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ReactSVG
            src="../svgs/soundcloud.svg"
            wrapper="div"
            beforeInjection={(svg) => {
              svg.classList.add("social__icon");
            }}
          />
        </a>
      ) : null}

      {data.spotify ? (
        <a
          href={"https://" + data.spotify}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ReactSVG
            src="../svgs/spotify.svg"
            wrapper="div"
            beforeInjection={(svg) => {
              svg.classList.add("social__icon");
            }}
          />
        </a>
      ) : null}

      {data.youtube ? (
        <a
          href={"https://" + data.youtube}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ReactSVG
            src="../svgs/youtube.svg"
            wrapper="div"
            beforeInjection={(svg) => {
              svg.classList.add("social__icon");
            }}
          />
        </a>
      ) : null}

      {data.linkedin ? (
        <a
          href={"https://" + data.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ReactSVG
            src="../svgs/linkedin.svg"
            wrapper="div"
            beforeInjection={(svg) => {
              svg.classList.add("social__icon");
            }}
          />
        </a>
      ) : null}

      {data.website ? (
        <a
          href={"https://" + data.website}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ReactSVG
            src="../svgs/website.svg"
            wrapper="div"
            beforeInjection={(svg) => {
              svg.classList.add("social__icon");
            }}
          />
        </a>
      ) : null}
    </div>
  );
};

export default Social;
