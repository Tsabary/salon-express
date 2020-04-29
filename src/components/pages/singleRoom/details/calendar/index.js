import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";

import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactTooltip from "react-tooltip";

import { AuthContext } from "../../../../../providers/Auth";

import { fetchEvents, addEvent, deleteEvent } from "../../../../../actions";

import Event from "./event";
import InputField from "../../../../formComponents/inputField";
import { renderHours, renderMinutes } from "../../../../../utils/forms";
import { FloorContext } from "../../../../../providers/Floor";

const Calendar = ({
  events,
  room,
  donations,
  fetchEvents,
  addEvent,
  deleteEvent,
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { floor } = useContext(FloorContext);
  const [event, setEvent] = useState({});

  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  useEffect(() => {
    if (!event || (event && !event.start)) return;

    const hr = hours ? parseInt(hours.split(" ")[0], 10) : 0;
    const min = minutes ? parseInt(minutes.split(" ")[0], 10) : 0;

    const hrMilli = hr * 3600000;
    const minMilli = min * 60000;

    const duration = hrMilli + minMilli;
    const end = new Date(event.start.getTime() + duration);

    setEvent({ ...event, end });
  }, [event.start, hours, minutes]);

  useEffect(() => {
    if (room) fetchEvents(room);
  }, [room]);

  const renderEvents = (events) => {
    return events.map((event) => {
      return <Event event={event} room={room} key={event.id} />;
    });
  };

  return (
    <div
      className={
        donations ||
        (currentUserProfile &&
          (currentUserProfile.uid === room.user_ID ||
            (floor && currentUserProfile.uid === floor.user_ID)))
          ? "details__calendar--with-donations section__container"
          : "details__calendar--without-donations section__container"
      }
    >
      <div className="max-max">
        <div className="section__title">Calendar</div>

        <>
          <div
            className="info"
            data-tip="calendarInfo"
            data-for="calendarInfo"
          />
          <ReactTooltip id="calendarInfo">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  "Choose the time in your current timezone.<br />We will do the conversion for everyone else.",
              }}
            />
          </ReactTooltip>
        </>
      </div>

      {currentUserProfile &&
      (currentUserProfile.uid === room.user_ID ||
        (floor && currentUserProfile.uid === floor.user_ID)) ? (
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            if (event && event.title && event.start)
              addEvent(event, room, () => setEvent({}));
          }}
        >
          <div className="tile-form">
            <div>
              <InputField
                type="text"
                placeHolder="Title"
                value={event && event.title}
                onChange={(title) => {
                  setEvent({
                    ...event,
                    title: title
                      .replace(/^([^-]*-)|-/g, "$1")
                      .replace(/[^\p{L}\s\d-]+/gu, ""),
                  });
                }}
              />
              <div className="calendar__date">
                <DatePicker
                  selected={event.start}
                  onChange={(start) => {
                    if (
                      Object.prototype.toString.call(start) === "[object Date]"
                    ) {
                      setEvent({
                        ...event,
                        start,
                      });
                    } else {
                      delete event.start;
                    }
                  }}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="input-field__input clickable"
                  placeholderText="Start (your time)"
                  minDate={new Date()}
                  excludeOutOfBoundsTimes
                />
              </div>
              <div className="fr-fr">
                <Form.Control
                  as="select"
                  bsPrefix="input-field__input form-drop extra-tiny-margin-top extra-tiny-margin-bottom"
                  value={hours}
                  onChange={(choice) => {
                    setHours(choice.target.value);
                  }}
                >
                  <option className="form-drop__default">Hr</option>
                  {renderHours()}
                </Form.Control>
                <Form.Control
                  as="select"
                  bsPrefix="input-field__input form-drop extra-tiny-margin-top extra-tiny-margin-bottom"
                  value={minutes}
                  onChange={(choice) => {
                    setMinutes(choice.target.value);
                  }}
                >
                  <option className="form-drop__default">Min</option>
                  {renderMinutes()}
                </Form.Control>
              </div>
            </div>
            <button type="submit" className="audio-settings__add">
              +
            </button>
          </div>
        </form>
      ) : null}

      <div className="calendar__events tiny-margin-top">
        {renderEvents(events)}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    events: state.events,
  };
};

export default connect(mapStateToProps, { fetchEvents, addEvent, deleteEvent })(
  Calendar
);
