import "./styles.scss";
import React from "react";
import { useHistory } from "react-router-dom";
import firebase from "firebase/app";
import { ReactSVG } from "react-svg";

import history from "../../../../history";

import { getLanguageName } from "../../../../utils/languages";

const SingleFloor = ({ floor }) => {
  const myHistory = useHistory(history);

  const handleChange = (path) => {
    firebase.analytics().logEvent("floor_edit_navigation");
    myHistory.push(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="single-floor">
      <div
        className="single-floor__title"
        onClick={() => handleChange(`/floor/${floor.id}`)}
      >
        {floor.name}
      </div>
      <div>{Object.keys(floor.rooms).length}</div>
      <div>{floor.tags.join(", ")}</div>
      <div>{getLanguageName(floor.language)}</div>
      <div>{"active"}</div>
      <div>
        <div
          className="clickable"
          onClick={() => handleChange(`/floor-management/${floor.id}`)}
        >
          <ReactSVG
            src="../svgs/edit.svg"
            wrapper="div"
            beforeInjection={(svg) => {
              svg.classList.add("svg-icon--normal");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleFloor;
