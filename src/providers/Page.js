import React, { useState } from "react";

export const PageContext = React.createContext();

export const PageProvider = ({ children }) => {
  const [page, setPage] = useState(1);

  return (
    <PageContext.Provider
      value={{
        page,
        setPage
      }}
    >
      {children}
    </PageContext.Provider>
  );
};