import "./styles.scss";
import React, { useContext } from "react";
import { titleToUrl } from "../../../../utils/strings";
import { useHistory } from "react-router-dom";
import history from "../../../../history";
import { RoomContext } from "../../../../providers/Room";

const MenuRoom = ({ room }) => {
    const myHistory = useHistory(history);
    
    const { globalRoom } = useContext(RoomContext);


    return (
        <div
            className={globalRoom && globalRoom.id ===room.id?"menu-room menu-room--active" : "menu-room"}
      onClick={() => {
        myHistory.push(`/room/${titleToUrl(room.name)}-${room.id}`);
      }}
    >
      <div className="max-fr">
        <img
          className="menu-room__image"
          src={room.image ? room.image : "../imgs/placeholder.jpg"}
          alt="user"
        />
        <div className="menu-room__name">{room.name}</div>
      </div>
    </div>
  );
};

export default MenuRoom;
