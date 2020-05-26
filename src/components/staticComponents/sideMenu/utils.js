import React, { useContext } from "react";
import MenuRoom from "./menuRoom";
import MenuFloor from "./menuFloor";
import { GlobalContext } from "../../../providers/Global";


export const renderRooms = (rooms, setIsMenuOpen) => {

  return rooms.map((ro) => {
    return <MenuRoom room={ro} setIsMenuOpen={setIsMenuOpen} key={ro.id} />;
  });
};

export const renderFloors = (floors, setIsMenuOpen) => {
  return floors.map((fl) => {
    return <MenuFloor floor={fl} setIsMenuOpen={setIsMenuOpen} key={fl.id} />;
  });
};
