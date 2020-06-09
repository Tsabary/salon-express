import "./styles.scss";
import React, { useContext } from "react";
import { connect } from "react-redux";

import { ReactSVG } from "react-svg";
import Moment from "react-moment";
import ReactTooltip from "react-tooltip";
import { google, outlook, yahoo, ics } from "calendar-link";

import { AuthContext } from "../../../../../../providers/Auth";

import { deleteEvent } from "../../../../../../actions/rooms";
import { deleteEventFloor } from "../../../../../../actions/floors";
import { renderGoogleLink } from "../../../../../../utils/others";
import { FloorContext } from "../../../../../../providers/Floor";
import { titleToUrl } from "../../../../../../utils/strings";

const Event = ({
  event,
  roomIndex,
  floor,
  deleteEvent,
  deleteEventFloor,
  isOwner,
}) => {
  const { globalFloor, setGlobalFloor, setGlobalFloorRoom } = useContext(
    FloorContext
  );

  const startDate =
    Object.prototype.toString.call(event.start) === "[object Date]"
      ? event.start
      : event.start.toDate();

  const endDate =
    Object.prototype.toString.call(event.end) === "[object Date]"
      ? event.end
      : event.end.toDate();

  const myEvent = {
    title: event.title,
    description: `Join the party at https://salon.express/room/${event.room_ID}`,
    start: startDate,
    duration: [3, "hour"],
  };

  return (
    <div className="event">
      <div className="event__date">
        <Moment format="DD/MM/YYYY HH:mm">{startDate}</Moment>
      </div>
      <div className="event__main">
        <div className="event__title">{event.title}</div>
        {isOwner ? (
          <div
            className="clickable"
            onClick={() => {
              globalFloor
                ? deleteEventFloor(
                    event,
                    roomIndex,
                    globalFloor,
                    (newFloor) => {
                      setGlobalFloor(newFloor);
                      setGlobalFloorRoom(newFloor.rooms[roomIndex]);
                    }
                  )
                : deleteEvent(event);
            }}
          >
            <ReactSVG
              src="../svgs/trash.svg"
              wrapper="div"
              data-tip={`deleteEvent${event.id}`}
              data-for={`deleteEvent${event.id}`}
              beforeInjection={(svg) => {
                svg.classList.add("svg-icon--normal");
              }}
            />
            <ReactTooltip id={`deleteEvent${event.id}`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: "Clicking would remove this event immediately.",
                }}
              />
            </ReactTooltip>
          </div>
        ) : (
          <div />
        )}

        <div className="event__calendar">
          <ReactSVG
            src="../svgs/calendar.svg"
            wrapper="div"
            beforeInjection={(svg) => {
              svg.classList.add("svg-icon--normal");
            }}
          />

          <div className="event__calendar-options">
            <a
              href={renderGoogleLink(
                startDate,
                endDate,
                event.title.split(" ").join("%20"),
                `https://salon.express/room/${event.room_ID}`
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Add to Google Calendar
            </a>
          </div>
        </div>
      </div>
      {event.room ? (
        <>
          <div className="tiny-margin-top">Hosted by:</div>
          <a
            href={`https://salon.express/room/${titleToUrl(event.room.name)}-${
              event.room.id
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {event.room.name}
          </a>
        </>
      ) : null}
    </div>
  );
};

export default connect(null, { deleteEvent, deleteEventFloor })(Event);
