import "./styles.scss";
import React, { useContext } from "react";
import { titleToUrl } from "../../../../utils/strings";
import { useHistory } from "react-router-dom";
import history from "../../../../history";
import { FloorContext } from "../../../../providers/Floor";
import { RoomContext } from "../../../../providers/Room";

const MenuFloor = ({ floor, setIsMenuOpen }) => {
  const myHistory = useHistory(history);
  const { globalFloor, setGlobalFloorRoom } = useContext(FloorContext);
  const {setGlobalRoom} = useContext(RoomContext)

  return (
    <div
      className={
        globalFloor && globalFloor.id === floor.id
          ? "menu-floor menu-floor--active"
          : "menu-floor"
      }
      onClick={() => {
        myHistory.push(`/floor/${floor.url}`);
        setGlobalFloorRoom(null);
        setGlobalRoom(null)
        setIsMenuOpen(false);
      }}
    >
      <div className="max-fr">
        <img
          className="menu-floor__image"
          src={floor.image ? floor.image : "../imgs/placeholder.jpg"}
          alt="user"
        />
        <div className="menu-floor__name">{floor.name}</div>
      </div>
    </div>
  );
};

export default MenuFloor;
