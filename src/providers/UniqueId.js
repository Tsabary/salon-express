import React, { useState } from "react";

export const UniqueIdContext = React.createContext();

export const UniqueIdProvider = ({ children }) => {
  const [uniqueId, setUniqueId] = useState(Date.now());

  return (
    <UniqueIdContext.Provider
      value={{
        uniqueId,
        setUniqueId,
      }}
    >
      {children}
    </UniqueIdContext.Provider>
  );
};
