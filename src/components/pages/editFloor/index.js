import "./styles.scss";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import history from "../../../history";

import { fetchFloor, saveFloor } from "../../../actions/floors";

import Admins from "./admins";
import Basic from "./basic";
import Logo from "./logo";
import FloorPlans from "./floorPlans";
import Rooms from "./rooms";
import Crew from "./crew";

const EditFloor = ({
  match,
  myFloors,
  fetchFloor,
  saveFloor,
  checkUrlAvailability,
}) => {
  const myHistory = useHistory(history);

  const [floor, setFloor] = useState(null);
  const [chosenPlan, setChosenPlan] = useState(null);
  const [values, setValues] = useState({});

  const [tracks, setTracks] = useState({});

  const [rooms, setRooms] = useState({});

  const [imageAsFile, setImageAsFile] = useState("");

  useEffect(() => {
    if (!chosenPlan) return;
    chosenPlan.rooms.forEach((r, index) => {
      setRooms((ro) => {
        return {
          ...ro,
          [index]: { ...ro[index], shape: r.shape, coords: r.coords },
        };
      });
    });
  }, [chosenPlan]);

  useEffect(() => {
    if (floor) {
      setValues(floor);
      Object.values(floor.rooms).forEach((r, index) => {
        setRooms((ro) => {
          return { ...ro, [index]: r };
        });
      });
      setChosenPlan({
        image: floor.image,
        rooms: [...Object.values(floor.rooms)],
      });
    }
  }, [floor]);

  useEffect(() => {
    const thisFloor = myFloors.filter(
      (floor) => floor.id === match.params.id
    )[0];

    !thisFloor ? fetchFloor(match.params.id) : setFloor(thisFloor);
  }, [match.params.id, myFloors]);

  const handleSave = () => {
    // Chck values somehow //
    const newFloor = { ...values, rooms };
    saveFloor(
      newFloor,
      imageAsFile,
      tracks,
      () => {
        myHistory.push(`/floor-management`);
        console.log("admins", "newFloor.admins");
      },
      (e) => console.error(e)
    );
  };

  return (
    <div className="edit-floor">
      <div className="edit-floor__basic">
        <Basic
          floor={floor}
          values={values}
          setValues={setValues}
          setRooms={setRooms}
          setChosenPlan={setChosenPlan}
        />
        <div>
          <Logo values={values} setImageAsFile={setImageAsFile} />
          <Admins values={values} setValues={setValues} />
        </div>
      </div>

      {/** Choose Floor plan */}
      <FloorPlans
        values={values}
        setValues={setValues}
        chosenPlan={chosenPlan}
        setChosenPlan={setChosenPlan}
      />

      <Rooms
        rooms={rooms}
        setRooms={setRooms}
        setTracks={setTracks}
        chosenPlan={chosenPlan}
      />

      <Crew values={values} setValues={setValues} />

      <div className="boxed-button small-margin-top" onClick={handleSave}>
        Save
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    myFloors: state.myFloors,
  };
};

export default connect(mapStateToProps, {
  fetchFloor,
  saveFloor,
})(EditFloor);
