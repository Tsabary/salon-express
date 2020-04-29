import "./styles.scss";
import React, { useContext } from "react";

import { ReactSVG } from "react-svg";
import Moment from "react-moment";
import ReactTooltip from "react-tooltip";

import { AuthContext } from "../../../../../../providers/Auth";

import { deleteEvent } from "../../../../../../actions";
import { connect } from "react-redux";

const Event = ({ event, room, deleteEvent }) => {
  const { currentUserProfile } = useContext(AuthContext);

  const startDate =
    Object.prototype.toString.call(event.start) === "[object Date]"
      ? event.start
      : event.start.toDate();
  
      const endDate =
      Object.prototype.toString.call(event.end) === "[object Date]"
        ? event.end
        : event.end.toDate();

  const renderGoogleLink = (start, end) => {
    const timeOffset = `${new Date().getTimezoneOffset()}`;
    const hourOffset = parseInt(timeOffset.split(".")[0], 10) /60;

    const minuteOffset = timeOffset.split(".")[1]
      ? parseInt(timeOffset.split(".")[1], 10) /60
      : 0;

    
    const startYear = start.getYear() + 1900;

    const startMonth =
    start.getMonth() + 1 > 9
        ? `${start.getMonth() + 1}`
        : `0${start.getMonth() + 1}`;
    
    const startDay = start.getDate();

    const startHour =
    start.getHours() + hourOffset > 9
        ? `${start.getHours() + hourOffset}`
        : `0${start.getHours() + hourOffset}`;
    
    const startMinute =
    start.getMinutes() + minuteOffset > 9
        ? `${start.getMinutes() + minuteOffset}`
        : `0${start.getMinutes() + minuteOffset}`;

    
    
    const endYear = end.getYear() + 1900;
    const endMonth =
    end.getMonth() + 1 > 9
        ? `${end.getMonth() + 1}`
        : `0${end.getMonth() + 1}`;
    
    const endDay = end.getDate(); 
    
    const endHour =
    end.getHours() + hourOffset > 9
        ? `${end.getHours() + hourOffset}`
        : `0${end.getHours() + hourOffset}`;
    
    const endMinute =
    end.getMinutes() + minuteOffset > 9
        ? `${end.getMinutes() + minuteOffset}`
        : `0${end.getMinutes() + minuteOffset}`;

    const details = `Join the party at https://salon.express/room/${event.room_ID}`;

    const title = event.title.split(" ").join("%20");
    // %0A // this is how you create a line drop
    return `http://www.google.com/calendar/event?action=TEMPLATE&dates=${startYear}${startMonth}${startDay}T${startHour}${startMinute}00Z%2F${endYear}${endMonth}${endDay}T${endHour}${endMinute}00Z&text=${title}&details=${details}`;
  };

  return (
    <div className="event">
      <div className="event__date">
        <Moment format="DD/MM/YYYY HH:mm">{startDate}</Moment>
      </div>
      <div className="event__main">
        <div className="event__title">{event.title}</div>
        {currentUserProfile && currentUserProfile.uid === room.user_ID ? (
          <div className="clickable" onClick={() => deleteEvent(event)}>
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
              href={renderGoogleLink(startDate, endDate)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Add to Google Calendar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { deleteEvent })(Event);
