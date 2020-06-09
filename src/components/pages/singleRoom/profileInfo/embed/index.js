import "./styles.scss";
import React from "react";
import CopyIframeCode from "../../../../otherComponents/copyIframeCode";

const Embed = ({ profile }) => {
  return (
    <div className="embed section__container">
      <div className="section__title">Embed your profile</div>
      <div>
        Copy this code and paste it in your website to turn your personal
        website to your own virtual office
      </div>

      <CopyIframeCode profile={profile} />
    </div>
  );
};

export default Embed;
