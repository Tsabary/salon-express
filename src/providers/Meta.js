import React, { useState } from "react";

export const MetaContext = React.createContext();

export const MetaProvider = ({ children }) => {
  const [meta, setMeta] = useState({});

  return (
    <MetaContext.Provider
      value={{
        meta,
        setMeta,
      }}
    >
      {children}
    </MetaContext.Provider>
  );
};
