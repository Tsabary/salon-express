import React, { useState } from "react";

export const RoomContext = React.createContext();

export const RoomProvider = ({ children }) => {
  const [globalRoom, setGlobalRoom] = useState(null);
  const [globalCurrentAudioChannel, setGlobalCurrentAudioChannel] = useState(
    null
  );
  return (
    <RoomContext.Provider
      value={{
        globalRoom,
        setGlobalRoom,
        globalCurrentAudioChannel,
        setGlobalCurrentAudioChannel,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
