import './styles.scss';
import React, { useContext } from "react";
import Countdown from "react-countdown";

import { FloorContext } from "../../../../providers/Floor";

import { renderGoogleLink } from "../../../../utils/others";


const Coming = ({ openDate }) => {
  const { globalFloor } = useContext(FloorContext);

  return (
    <div className="coming">
      <div className="coming__container section__container">
        <img
          src={globalFloor ? globalFloor.image : ""}
          className="coming__floor-plan"
        />
        <div className="coming__title">The party starts in</div>
        <span className="coming__count">
          <Countdown date={openDate} />
        </span>

        <a
          className="coming__calendar small-button small-margin-top"
          href={renderGoogleLink(
            openDate,
            new Date(openDate.getTime() + 72000000),
            globalFloor.name,
            `https://salon.express/floor/${globalFloor.url}`
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Add to Google Calendar
        </a>
      </div>
    </div>
  );
};

export default Coming;
