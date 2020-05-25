import "./styles.scss";
import React, { useContext } from "react";
import HeaderAuth from "./auth";
import { ReactSVG } from "react-svg";
import { GlobalContext } from "../../../providers/Global";

const MinimalHeader = () => {
  const { isMenuOpen, setIsMenuOpen } = useContext(GlobalContext);

  return (
    <div className="minimal-header max-max-fr">
      <div
        className="clickable"
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
        }}
      >
        <ReactSVG
          src="../svgs/hamburger.svg"
          wrapper="div"
          beforeInjection={(svg) => {
            svg.classList.add("svg-icon--normal");
          }}
        />
      </div>
      <div className="minimal-header__logo">S.</div>
      <div />
    </div>
  );
};

export default MinimalHeader;
