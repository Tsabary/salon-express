import {
  FETCH_FAVORITES_LIST,
  ADD_TO_FAVORITES_LIST,
} from "../../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_FAVORITES_LIST:
      return action.payload;

    case ADD_TO_FAVORITES_LIST:
      return [...state, action.payload];

    default:
      return state;
  }
};
