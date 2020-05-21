import "./styles.scss";
import React, { useContext } from "react";
import { FloorContext } from "../../../providers/Floor";
import User from "../user/static";

const FloorDetails = () => {
  const { globalFloor, isDetailsVisible, setIsDetailsVisible } = useContext(
    FloorContext
  );

  const renderAdmins = (admins) => {
    return admins.map((admin) => {
      return <User user={admin} key={admin.uid} />;
    });
  };

  return globalFloor && isDetailsVisible ? (
    <div className="floor-details">
      <div className="modal-window">
        <div className="modal-window__content">
          <div className="popup__close">
            <div />
            <div
              className="popup__close-text"
              onClick={() => {
                setIsDetailsVisible(false);
              }}
            >
              Close
            </div>
          </div>

          <div className="floor-details__title">{globalFloor.name}</div>
          <div className="floor-details__description tiny-margin-top">
            {globalFloor.description}
          </div>

          <div className="small-margin-top">Admins:</div>
          <div className="fr-fr tiny-margin-top">{renderAdmins(globalFloor.admins)}</div>
        </div>
      </div>
    </div>
  ) : null;
};

export default FloorDetails;
