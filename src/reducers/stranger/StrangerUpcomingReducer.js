import {
  FETCH_NEW_STRANGER_UPCOMING,
  FETCH_MORE_STRANGER_UPCOMING,
} from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_STRANGER_UPCOMING:
      return action.payload;

    case FETCH_MORE_STRANGER_UPCOMING:
      return [...state, ...action.payload];

    default:
      return state;
  }
};
