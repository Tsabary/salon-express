import "./styles.scss";
import React from "react";

import { ReactSVG } from "react-svg";

const One = () => {
  return (
    <div className="one">
      {/* <div className="one__logo">
        <div className="header__title-main">Salon.</div>
        <div className="header__title-main extra-tiny-margin-top">Express</div>
      </div> */}

      <ReactSVG
        src="../svgs/group_video_call.svg"
        wrapper="div"
        beforeInjection={(svg) => {
          svg.classList.add("svg-icon--huge");
        }}
      />

<div className="on-boarding__title tiny-margin-top">Welcome</div>
<div className="on-boarding__sutitle tiny-margin-top">Salon Express Rooms: Friendly, Fun, Secure.</div>
    </div>
  );
};

export default One;
