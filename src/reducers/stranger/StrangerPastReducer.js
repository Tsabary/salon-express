import {
  FETCH_NEW_STRANGER_PAST,
  FETCH_MORE_STRANGER_PAST
} from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_STRANGER_PAST:
      return action.payload;

    case FETCH_MORE_STRANGER_PAST:
      return [...state, ...action.payload];

    default:
      return state;
  }
};
