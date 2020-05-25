import React, { useState } from "react";

export const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isNewRoomPublic, setIsNewRoomPublic] = useState(false);
  const [upgradePlan, setUpgradePlan] = useState(null);

  return (
    <GlobalContext.Provider
      value={{
        isMenuOpen,
        setIsMenuOpen,
        isNewRoomPublic,
        setIsNewRoomPublic,
        upgradePlan,
        setUpgradePlan,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
