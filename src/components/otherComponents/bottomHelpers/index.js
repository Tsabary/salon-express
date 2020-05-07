import "./styles.scss";
import React from "react";

import Updates from "./updates";
import Faq from "./faq";

const BottomHelpers = () => {
  return (
    <div className="bottom-helpers">
      <Faq />
      <Updates />
    </div>
  );
};

export default BottomHelpers;
