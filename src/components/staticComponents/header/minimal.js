import "./styles.scss";
import React, { useContext } from "react";
import HeaderAuth from "./auth";
import { ReactSVG } from "react-svg";
import { GlobalContext } from "../../../providers/Global";
import { useHistory } from "react-router-dom";
import history from "../../../history";

const MinimalHeader = () => {
  const myHistory = useHistory(history);
  const { isMenuOpen, setIsMenuOpen } = useContext(GlobalContext);

  return (
    <div className="minimal-header fr-max">
      {/* <div
        className="clickable"
        onClick={() => {
          setIsMenuOpen((val) => {
            return !val;
          });
        }}
      >
        <ReactSVG
          src="../svgs/hamburger.svg"
          wrapper="div"
          beforeInjection={(svg) => {
            svg.classList.add("svg-icon--normal");
          }}
        />
      </div> */}
      <div
        className="minimal-header__logo clickable"
        onClick={() => myHistory.push("/")}
      >
        S.
      </div>
      <div className="max-max">
      <div className="max-max">
        <h2>Marketplace</h2>
        <h2>Events</h2>
      </div>
      <div className="max-max-max tiny-margin-right">
        <h2 onClick={()=> myHistory.push("/blog")}>Guides</h2>
        <h2 onClick={()=> myHistory.push("/pricing")}>Pricing</h2>
        <h2 onClick={()=> myHistory.push("/contact")}>Contact</h2>
      </div></div>
    </div>
  );
};

export default MinimalHeader;
