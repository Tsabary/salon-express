import { FETCH_SUGGESTIONS } from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_SUGGESTIONS:
      return action.payload;

    default:
      return state;
  }
};
