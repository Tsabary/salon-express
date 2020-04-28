import React, { useState } from "react";

export const FloorContext = React.createContext();

export const FloorProvider = ({ children }) => {
  const [floor, setFloor] = useState(null);
  const [floorRooms, setFloorRooms] = useState(null);

  return (
    <FloorContext.Provider
      value={{
        floor,
        setFloor,
        floorRooms,
        setFloorRooms,
      }}
    >
      {children}
    </FloorContext.Provider>
  );
};
