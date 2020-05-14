import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

export const UniqueIdContext = React.createContext();

export const UniqueIdProvider = ({ children }) => {
  const [uniqueId, setUniqueId] = useState(uuidv4());

  useEffect(() => {
    const uid = Cookies.get("salonexpressrandomuid");
    if (!uid) {
      const newUid = uuidv4();
      Cookies.set("salonexpressrandomuid", newUid);
      setUniqueId(newUid);
    } else {
      setUniqueId(uid);
    }
  });

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
