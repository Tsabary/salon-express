import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const UniqueIdContext = React.createContext();

export const UniqueIdProvider = ({ children }) => {
  const [uniqueId, setUniqueId] = useState(uuidv4());

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
