import React, { useState } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { ReactSVG } from "react-svg";
import ReactTooltip from "react-tooltip";

import firebase from "../../../firebase";

const CopyIframeCode = ({ profile }) => {
  const iframeCode = `<iframe width="100%" height="100%" src=${`"https://www.salon.express/embed/${profile.username}"`} frameborder="0" allowfullscreen></iframe>`;

  const [isCopyHover, setIsCopyHover] = useState(false);
  const [copyCode, setCopyCode] = useState("Click to copy");

  const copyButtonTimer = () => {
    setTimeout(() => {
      setCopyCode("Click to copy");
    }, 3000);
  };

  return (
    <div className="fr-max tiny-margin-top">
      <input
        className="input-field__input clickable"
        onFocus={(e) => e.target.select()}
        value={iframeCode}
        style={{ color: "#ababab" }}
      />

      <CopyToClipboard
        text={iframeCode}
        data-tip
        data-for="copy-embed-code"
        onCopy={() => {
          setCopyCode("Copied!");
          copyButtonTimer();
          firebase.analytics().logEvent("profile_embed_link_copied");
        }}
      >
        <div
          className="info-bar-actions__action"
          onMouseEnter={() =>
            setIsCopyHover((val) => {
              return !val;
            })
          }
          onMouseLeave={() =>
            setIsCopyHover((val) => {
              return !val;
            })
          }
        >
          <ReactSVG
            src={isCopyHover ? "../svgs/copy_white.svg" : "../svgs/copy.svg"}
            wrapper="div"
            beforeInjection={(svg) => {
              svg.classList.add("svg-icon--normal");
            }}
          />
        </div>
      </CopyToClipboard>

      <ReactTooltip id="copy-embed-code">
        <div>{copyCode}</div>
      </ReactTooltip>
    </div>
  );
};

export default CopyIframeCode;
