import "./styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loader-spinner";
import Form from "react-bootstrap/Form";
import { useToasts } from "react-toast-notifications";
import ReactTooltip from "react-tooltip";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  ImageWithZoom,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

import { AuthContext } from "../../../providers/Auth";

import { newFloor, fetchFloorPlans } from "../../../actions/floors";
import { checkValidity, errorMessages } from "../../../utils/forms";

import { validateWordsLength } from "../../../utils/strings";
import {
  renderLanguageOptions,
  getLanguageCode,
  getLanguageName,
} from "../../../utils/languages";

import InputField from "../../formComponents/inputField";
import Tags from "../../formComponents/tags";

const NewFloor = ({ floorPlans, newFloor, fetchFloorPlans }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const { addToast } = useToasts();

  const [values, setValues] = useState({});

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [chosenPlan, setChosenPlan] = useState(null);

  useEffect(() => {
    if (!floorPlans.length) fetchFloorPlans();
  });

  useEffect(() => {
    if (currentUserProfile) {
      reset(currentUserProfile);
    }
  }, [currentUserProfile]);

  // Reset the form
  const reset = (currentUserProfile) => {
    setValues({
      user_ID: currentUserProfile.uid,
      admins: [currentUserProfile.email],
      open: new Date(),
      visitors: [],
    });
    setSubmitting(false);
  };

  // Handle the submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkValidity(values, setFormError)) {
      return;
    }

    setFormError(null);
    setSubmitting(true);

    newFloor(values, () => {
      addToast("Floor Created Succesfully", {
        appearance: "success",
        autoDismiss: true,
      });
      reset(currentUserProfile);
      window.location.hash = "";
    });
  };

  const renderSildes = (plans) => {
    return plans.map((plan, index) => {
      return (
        <Slide index={index} key={index}>
          <ImageWithZoom
            src={plan.image}
            className="clickable extra-tiny-margin-right"
            onClick={() => {
              setChosenPlan(plan);
              setValues((val) => {
                return {
                  ...val,
                  rooms: plan.rooms,
                  image: plan.image,
                };
              });
            }}
          />
        </Slide>
      );
    });
  };

  return (
    <div className="popup" id="add-floor">
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
            <div className="popup__title" onClick={() => console.log(values)}>
              Open a Floor
            </div>
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
                  placeHolder="Floor name"
                  value={values.name}
                  onChange={(name) => {
                    if (name.length < 80 && validateWordsLength(name, 25))
                      setValues((val) => {
                        return { ...val, name };
                      });
                  }}
                />
              </div>

              <Form.Control
                as="select"
                bsPrefix="input-field__input form-drop tiny-margin-bottom"
                value={
                  values.language ? getLanguageName(values.language) : undefined
                }
                onChange={(choice) => {
                  if (choice.target.value !== "Choose a language")
                    setValues({
                      ...values,
                      language: getLanguageCode(choice.target.value),
                    });
                }}
              >
                {renderLanguageOptions("Choose a language")}
              </Form.Control>
              <div className="new-floor-plan__image-container">
                <img
                  className="new-floor-plan__image-preview"
                  src={
                    (chosenPlan && chosenPlan.image) ||
                    "../../../imgs/placeholder.jpg"
                  }
                />
              </div>
              <div className="tiny-margin-bottom tiny-margin-top">
                <CarouselProvider
                  naturalSlideWidth={12}
                  naturalSlideHeight={9}
                  totalSlides={
                    floorPlans && floorPlans.length ? floorPlans.length : 0
                  }
                  visibleSlides={
                    !floorPlans
                      ? 0
                      : !floorPlans.length
                      ? 0
                      : floorPlans.length > 3
                      ? 3
                      : floorPlans.length
                  }
                  hasMasterSpinner
                >
                  {floorPlans ? (
                    <Slider className="new-floor__carousel">
                      {renderSildes(floorPlans)}
                    </Slider>
                  ) : null}
                  <div className="max-fr-max tiny-margin-top">
                    <ButtonBack className="small-button">Back</ButtonBack>
                    <div className="centered-text new-floor__choose">
                      Choose a Floor plan
                    </div>
                    <ButtonNext className="small-button">Next</ButtonNext>
                  </div>
                </CarouselProvider>
              </div>

              <Tags
                values={values}
                setValues={setValues}
                errorMessages={errorMessages}
                formError={formError}
                setFormError={setFormError}
              />

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

const mapStateToProps = (state) => {
  return {
    floorPlans: state.floorPlans,
  };
};

export default connect(mapStateToProps, {
  newFloor,
  fetchFloorPlans,
})(NewFloor);
