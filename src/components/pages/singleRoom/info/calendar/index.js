import "./styles.scss";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactTooltip from "react-tooltip";
import { v4 as uuidv4 } from "uuid";

import { fetchEvents, addEvent } from "../../../../../actions/rooms";
import { addEventFloor } from "../../../../../actions/floors";

import Event from "./event";
import InputField from "../../../../formComponents/inputField";
import { renderHours, renderMinutes } from "../../../../../utils/forms";

const Calendar = ({
  events,
  entityID,
  roomIndex,
  floor,
  isOwner,
  fetchEvents,
  addEvent,
  addEventFloor,
}) => {
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
    if (entityID && !floor) fetchEvents(entityID);
  }, [entityID]);

  const dateCompare = (a, b) => {
    return a.start.toDate() > b.start.toDate()
      ? 1
      : a.start.toDate() === b.start.toDate()
      ? a.end.toDate() > b.end.toDate()
        ? 1
        : -1
      : -1;
  };

  const renderEvents = (events) => {
    return events.map((event) => {
      return (
        <Event
          event={event}
          roomIndex={roomIndex}
          floor={floor}
          isOwner={isOwner}
          key={event.id}
        />
      );
    });
  };

  const filterFloorEvents = (events) => {
    return events
      .filter((ev) => ev.start.toDate() > new Date())
      .sort(dateCompare);
  };


  const onWheel = (e) => {
    e.preventDefault();
    var container = document.getElementById("eventsScroll");
    var containerScrollPosition = document.getElementById("eventsScroll")
      .scrollLeft;
    container.scrollTo({
      top: 0,
      left: containerScrollPosition + e.deltaY,
      behaviour: "smooth", //if you want smooth scrolling
    });
  };

  return (
    <div className=" section__container">
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

      <div className="calendar__divide">
        {isOwner ? (
          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              if (event && event.title && event.start)
                !floor
                  ? addEvent(event, entityID, () => setEvent({}))
                  : addEventFloor(
                      { ...event, id: uuidv4() },
                      roomIndex,
                      floor,
                      () => setEvent({})
                    );
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
                        Object.prototype.toString.call(start) ===
                        "[object Date]"
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
                    timeIntervals={15}
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
              <button type="submit" className="audio-settings__button">
                +
              </button>
            </div>
          </form>
        ) : null}

        {(!floor && events.length) ||
        (floor &&
          floor.rooms[roomIndex] &&
          floor.rooms[roomIndex].events &&
          filterFloorEvents(floor.rooms[roomIndex].events)) ? (
          <div
            className="calendar__events tiny-margin-top"
            id="eventsScroll"
            onWheel={onWheel}
          >
            {renderEvents(
              floor ? filterFloorEvents(floor.rooms[roomIndex].events) : events
            )}
          </div>
        ) : (
          <div className="calendar__empty">
            This Room has no future events planned at the moment
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    events: state.events,
  };
};

export default connect(mapStateToProps, {
  fetchEvents,
  addEvent,
  addEventFloor,
})(Calendar);
