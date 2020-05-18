import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

export const UniqueIdContext = React.createContext();

export const UniqueIdProvider = ({ children }) => {
  const [uniqueId, setUniqueId] = useState(uuidv4());
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const uuid = Cookies.get("salonexpressrandomuid");
    if (!uuid) {
      const newUuid = uuidv4();
      Cookies.set("salonexpressrandomuid", newUuid);
      setUniqueId(newUuid);
      setIsFirstVisit(true);
    } else {
      setUniqueId(uuid);
    }
  });

  return (
    <UniqueIdContext.Provider
      value={{
        uniqueId,
        setUniqueId,
        isFirstVisit,
        setIsFirstVisit,
      }}
    >
      {children}
    </UniqueIdContext.Provider>
  );
};
