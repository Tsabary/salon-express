import "./styles.scss";
import React, { useState } from "react";
import Iframe from "react-iframe";
import Fullscreen from "react-full-screen";
import { ReactSVG } from "react-svg";
import ReactTooltip from "react-tooltip";
import { isMobile } from "react-device-detect";

const IFrame = ({ url, height, source }) => {
  const [isFull, setIsFull] = useState(false);

  return (
    <div
      className={
        source !== "mixlr"
          ? "my-iframe"
          : "my-iframe--border"
      }
    >
      <Fullscreen enabled={isFull} onChange={(isFull) => setIsFull(isFull)}>
        <Iframe
          width="100%"
          height={isFull ? "100%" : `${height}px`}
          src={url}
          frameborder="0"
          allow="fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          styles={{ overflowX: "none" }}
          className="my-iframe__content"
        />
      </Fullscreen>
      {source === "website" ? (
        <div className="my-iframe__fullscreen-btns">
          <div
            className="my-iframe__fullscreen-btn"
            onClick={() => setIsFull(true)}
          >
            <ReactSVG
              src="../../svgs/copy.svg"
              wrapper="div"
              beforeInjection={(svg) => {
                svg.classList.add("svg-icon--normal");
              }}
              data-tip="iframeCopy"
              data-for="iframeCopy"
            />
            <ReactTooltip id="iframeCopy">
              <div style={{ width: "maxContent" }}>Copy URL</div>
            </ReactTooltip>
          </div>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="my-iframe__fullscreen-btn"
          >
            <ReactSVG
              src="../../svgs/link.svg"
              wrapper="div"
              beforeInjection={(svg) => {
                svg.classList.add("svg-icon--normal");
              }}
              data-tip="iframeLink"
              data-for="iframeLink"
            />

            <ReactTooltip id="iframeLink">
              <div style={{ width: "maxContent" }}>Follow URL</div>
            </ReactTooltip>
          </a>

          <div
            className="my-iframe__fullscreen-btn"
            onClick={() => setIsFull(true)}
          >
            <ReactSVG
              src="../../svgs/expandColor.svg"
              wrapper="div"
              beforeInjection={(svg) => {
                svg.classList.add("svg-icon--normal");
              }}
              data-tip="iframeFullscreen"
              data-for="iframeFullscreen"
            />
            <ReactTooltip id="iframeFullscreen">
              <div style={{ width: "maxContent" }}>Fullscreen</div>
            </ReactTooltip>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default IFrame;
