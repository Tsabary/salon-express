import React from "react";

import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  ImageWithZoom,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { connect } from "react-redux";

const FloorPlans = ({values, setValues,chosenPlan, setChosenPlan, floorPlans}) => {
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
                  // rooms: plan.rooms,
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
    <div className="edit-floor__section">
      <div className="edit-floor__section-title">Choose your floor plan</div>
      <div className="edit-floor__plans">
        <CarouselProvider
          naturalSlideWidth={12}
          naturalSlideHeight={9}
          totalSlides={floorPlans && floorPlans.length ? floorPlans.length : 0}
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

        <div className="edit-floor__current-plan">
          <img
            className="new-floor-plan__image-preview"
            src={
              (chosenPlan && chosenPlan.image) ||
              (values && values.image) ||
              "../../../imgs/placeholder.jpg"
            }
            alt="Floor plan"
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    floorPlans: state.floorPlans,
  };
};

export default connect(mapStateToProps, {})(FloorPlans);
