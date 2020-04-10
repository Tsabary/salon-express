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

/**
 * PAGES:
 * 1. EXPLORE
 * 2. SUBSCRIPTION
 * 3. CALENDAR
 * 4. MY STREAMS
 * 5. TAG FILTER
 * 6. PROFILE
 * 7. CONTACT
 */