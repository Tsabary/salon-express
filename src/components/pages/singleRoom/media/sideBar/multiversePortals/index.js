import "./styles.scss";
import React, { useState } from "react";

import { titleToKey } from "../../../../../../utils/strings";

import Portal from "../portal";
import InputField from "../../../../../formComponents/inputField";

const MultiversePortals = ({
  entityID,
  currentPortal,
  setCurrentPortal,
  multiverseArray,
  microphonePermissionGranted,
  cameraPermissionGranted,
}) => {
  // We use this to filter portals by user text search
  const [query, setQuery] = useState("");

  // Render the portals to the page
  const renderPortals = (multiverse, query) => {
    return multiverse
      .filter(
        (el) =>
          el.title && el.title.toLowerCase().startsWith(query.toLowerCase())
      )
      .map((portal) => {
        return (
          <Portal
            portal={portal}
            currentPortal={currentPortal}
            setCurrentPortal={setCurrentPortal}
            entityID={entityID}
            microphonePermissionGranted={microphonePermissionGranted}
            cameraPermissionGranted={cameraPermissionGranted}
            key={titleToKey(portal.title)}
          />
        );
      });
  };

  return (
    <div>
      <InputField
        type="text"
        placeHolder="Find a portal"
        value={query}
        onChange={setQuery}
      />
      
      <div className="multiverse-portals">
        {multiverseArray ? renderPortals(multiverseArray, query) : null}
      </div>
    </div>
  );
};

export default MultiversePortals;
