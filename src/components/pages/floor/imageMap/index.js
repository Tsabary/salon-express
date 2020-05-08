import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";

import { FloorContext } from "../../../../providers/Floor";

import ImageMapper from "react-image-mapper";
import { Howl, Howler } from "howler";

const ImageMap = () => {
  const { globalFloor, setGlobalFloorRoom } = useContext(FloorContext);

  useEffect(() => {
    console.log("floor", globalFloor)
  },[globalFloor])

  const [sound, setSound] = useState();
  const [values, setValues] = useState({
    hoveredArea: null,
    msg: null,
    moveMsg: null,
  });
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [mapWidth, setMapWidth] = useState(0);

  useEffect(() => {
    switch (true) {
      case windowDimensions.width > 1000:
        setMapWidth(windowDimensions.width * 0.6);
        break;

      case windowDimensions.width < 1000:
        setMapWidth(windowDimensions.width * 0.6);
        break;

      case windowDimensions.width < 500:
        setMapWidth(windowDimensions.width * 0.4);
        break;

      default:
        setMapWidth(windowDimensions.width * 0.3);
    }
  }, [windowDimensions]);

  const updateWindowDimensions = () => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", updateWindowDimensions);

    return function cleanup() {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  });

  useEffect(() => {
    if (sound) sound.play();
  }, [sound]);

  const playSound = (area) => {
    pauseSound(sound)
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
          width={mapWidth}
          imgWidth={1500}
          onClick={(area) => clicked(area)}
          onMouseEnter={(area) => enterArea(area)}
          onMouseLeave={(area) => leaveArea(area)}
          onImageMouseMove={() => {
            pauseSound(sound);
          }}
        />
      ) : null}

      {values.hoveredArea && (
        <span
          className="image-map__tooltip"
          style={{ ...getTipPosition(values.hoveredArea) }}
        >
          <div className="image-map__tooltip--name">

            {values.hoveredArea && values.hoveredArea.name}
          </div>
          <div className="image-map__tooltip--description tiny-margin-top">
            {values.hoveredArea && values.hoveredArea.description}
          </div>
        </span>
      )}
    </div>
  );
};

export default ImageMap;
