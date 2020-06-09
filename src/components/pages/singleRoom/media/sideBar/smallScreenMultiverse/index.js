import "./styles.scss";
import React, { useEffect, useState } from "react";

import MultiverseForm from "../multiverseForm";
import MultiversePortals from "../multiversePortals";

const SmallScreenMultiverse = ({
  entityID,
  currentPortal,
  setCurrentPortal,
  multiverse,
  multiverseArray,
  isFirstLoad,
  setIsFirstLoad,
  microphonePermissionGranted,
  cameraPermissionGranted,
}) => {
  const [open, setOpen] = useState(false);

  // If it's not the first load or if we don't have anything in the multiverse array then return, because we either don't need to automatically pick the portal (not the first load) or there is no portal to choose
  useEffect(() => {
    if (!isFirstLoad || !multiverseArray || !multiverseArray.length) return;
    {
      setCurrentPortal((val) => {
        return { new: multiverseArray[0], old: val ? val.new : null };
      });
      setIsFirstLoad(false);
    }
  }, [multiverseArray]);

  return (
    <div className="ss-multiverse">
      <div className="ss-multiverse__container">
        <input
          className="ss-multiverse__checkbox"
          type="checkbox"
          id="ssMultiverse"
          onChange={() => setOpen(!open)}
          // readOnly
        />
        <label
          className="max-max mobile-multiverse__top mobile-multiverse__title"
          htmlFor="ssMultiverse"
        >
          Multiverse
        </label>
        <div className="ss-multiverse__channels">
          <MultiverseForm
            entityID={entityID}
            multiverse={multiverse}
            currentPortal={currentPortal}
            setCurrentPortal={setCurrentPortal}
          />
          <div className="extra-tiny-margin-top" />
          <MultiversePortals
            entityID={entityID}
            currentPortal={currentPortal}
            setCurrentPortal={setCurrentPortal}
            multiverseArray={multiverseArray}
            microphonePermissionGranted={microphonePermissionGranted}
            cameraPermissionGranted={cameraPermissionGranted}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="ss-multiverse">
      <MultiverseForm
        entityID={entityID}
        multiverse={multiverse}
        currentPortal={currentPortal}
        setCurrentPortal={setCurrentPortal}
      />
      <div className="extra-tiny-margin-top" />
      <MultiversePortals
        entityID={entityID}
        currentPortal={currentPortal}
        setCurrentPortal={setCurrentPortal}
        multiverseArray={multiverseArray}
        microphonePermissionGranted={microphonePermissionGranted}
        cameraPermissionGranted={cameraPermissionGranted}
      />
    </div>
  );
};

export default SmallScreenMultiverse;
