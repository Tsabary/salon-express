import { FETCH_TAGS } from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_TAGS:
      return action.payload;

    default:
      return state;
  }
};
