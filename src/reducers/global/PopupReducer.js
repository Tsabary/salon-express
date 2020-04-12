import { TOGGLE_POPUP } from "../../actions/types";

export default (state = false, action) => {
  switch (action.type) {
    case TOGGLE_POPUP:
      return action.payload;

    default:
      return state;
  }
};
