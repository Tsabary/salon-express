import { SET_FLOOR_PLANS } from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case SET_FLOOR_PLANS:
      return action.payload;

    default:
      return state;
  }
};
