import React, { useState } from "react";

export const FloorContext = React.createContext();

export const FloorProvider = ({ children }) => {
  const [globalFloor, setGlobalFloor] = useState(null);
  const [globalFloorRoom, setGlobalFloorRoom] = useState(null);
  const [globalFloorRoomIndex, setGlobalFloorRoomIndex] = useState(null);

  return (
    <FloorContext.Provider
      value={{
        globalFloor,
        setGlobalFloor,
        globalFloorRoom,
        setGlobalFloorRoom,
        globalFloorRoomIndex,
        setGlobalFloorRoomIndex,
      }}
    >
      {children}
    </FloorContext.Provider>
  );
};
