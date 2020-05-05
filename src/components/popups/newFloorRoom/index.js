import "./styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loader-spinner";
import { useToasts } from "react-toast-notifications";

import { AuthContext } from "../../../providers/Auth";
import { FloorContext } from "../../../providers/Floor";

import { newFloorRoom } from "../../../actions";
// import { checkValidity, errorMessages } from "../../../utils/forms";

import { validateWordsLength } from "../../../utils/strings";

import InputField from "../../formComponents/inputField";
import TextArea from "../../formComponents/textArea";

const NewRoom = ({ newFloorRoom }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { floor } = useContext(FloorContext);
  const { addToast } = useToasts();

  const [values, setValues] = useState({});

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUserProfile) {
      reset(currentUserProfile);
    }
  }, [currentUserProfile]);

  // Reset the form
  const reset = (currentUserProfile) => {
    setValues({ shape: "rect", user_ID: currentUserProfile.uid });
    setSubmitting(false);
  };

  // Handle the submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!floor) return;
    // if (!checkValidity(values, setFormError)) {
    //   return;
    // }
    setFormError(null);
    setSubmitting(true);

    newFloorRoom(
      {
        ...values,
        floor_ID: floor.id,
        coords: values.coords.split(",").map((coord) => parseInt(coord, 10)),
      },
      () => {
        addToast("Room Created Succesfully", {
          appearance: "success",
          autoDismiss: true,
        });
        reset(currentUserProfile);
        window.location.hash = "";
      }
    );
  };

  return (
    <div className="popup" id="add-floor-room">
      <div className="popup__close">
        <div />
        <div
          className="popup__close-text"
          onClick={() => {
            reset(currentUserProfile);
            window.location.hash = "";
          }}
        >
          Close
        </div>
      </div>
      <div>
        {!submitting ? (
          <div>
            <div className="popup__title">Open a Room</div>
            <form
              onSubmit={(e) => {
                console.log("nothing");
              }}
              className="small-margin-top"
              autoComplete="off"
            >
              <div className="tiny-margin-bottom">
                <InputField
                  type="text"
                  placeHolder="Room name"
                  value={values.name}
                  onChange={(name) => {
                    if (name.length < 80 && validateWordsLength(name, 25))
                      setValues({ ...values, name });
                  }}
                />
              </div>

              <div className="tiny-margin-bottom">
                <TextArea
                  type="text"
                  placeHolder="Description"
                  value={values.description}
                  onChange={(description) => {
                    if (
                      description.length < 80 &&
                      validateWordsLength(description, 25)
                    )
                      setValues({ ...values, description });
                  }}
                />
              </div>

              <div className="tiny-margin-bottom">
                <InputField
                  type="text"
                  placeHolder="Map coords"
                  value={values.coords}
                  onChange={(coords) => setValues({ ...values, coords })}
                />
              </div>

              {formError ? (
                <div className="form-error small-margin-top">{formError}</div>
              ) : null}
              <div className="popup__button tiny-margin-top">
                <button
                  type="button"
                  className="boxed-button"
                  onClick={handleSubmit}
                >
                  Open
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="centered">
            <Loader type="Grid" color="#6f00ff" height={100} width={100} />
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(null, {
  newFloorRoom,
})(NewRoom);
