import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";

import { FloorContext } from "../../../../providers/Floor";

import ImageMapper from "react-image-mapper";
import { Howl, Howler } from "howler";

const ImageMap = () => {
  const { globalFloor, setGlobalFloorRoom } = useContext(FloorContext);

  const [sound, setSound] = useState();
  const [values, setValues] = useState({
    hoveredArea: null,
    msg: null,
    moveMsg: null,
  });

  useEffect(() => {
    if (sound) sound.play();
  }, [sound]);

  const playSound = (area) => {
    if (!area.track) return;

    setSound(
      new Howl({
        src: [area.track.file],
      })
    );
  };

  const pauseSound = (s) => {
    if (s) s.stop();
  };

  const clicked = (area) => {
    setGlobalFloorRoom(area);
    pauseSound();
    setValues((val) => {
      return {
        ...val,
        msg: `You clicked on ${area.id} at coords ${JSON.stringify(
          area.coords
        )} !`,
      };
    });
  };

  const enterArea = (area) => {
    playSound(area);

    setValues((val) => {
      return { ...val, hoveredArea: area };
    });
  };

  const leaveArea = () => {
    pauseSound(sound);

    setValues((val) => {
      return { ...val, hoveredArea: null };
    });
  };

  const getTipPosition = (area) => {
    return { top: `${area.center[1]}px`, left: `${area.center[0]}px` };
  };

  return (
    <div className="image-map">
      {globalFloor ? (
        <ImageMapper
          src={globalFloor.image}
          map={{
            name: "my-map",
            areas:
              globalFloor && globalFloor.rooms
                ? Object.values(globalFloor.rooms)
                : [],
          }}
          width={800}
          imgWidth={1500}
          onClick={(area) => clicked(area)}
          onMouseEnter={(area) => enterArea(area)}
          onMouseLeave={(area) => leaveArea(area)}
        />
      ) : null}

      {values.hoveredArea && (
        <span
          className="image-map__tooltip"
          style={{ ...getTipPosition(values.hoveredArea) }}
        >
          <div> {values.hoveredArea && values.hoveredArea.name}</div>
          <div className="tiny-margin-top">
            {values.hoveredArea && values.hoveredArea.description}
          </div>
        </span>
      )}
    </div>
  );
};

export default ImageMap;
