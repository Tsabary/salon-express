import { FETCH_STRANGER_PROFILE } from "../../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_STRANGER_PROFILE:
      return action.payload;

    default:
      return state;
  }
};
