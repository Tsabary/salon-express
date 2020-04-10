import {
  FETCH_NEW_STRANGER_LIVE,
  FETCH_MORE_STRANGER_LIVE,

} from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_STRANGER_LIVE:
      return action.payload;

    case FETCH_MORE_STRANGER_LIVE:
      return [...state, ...action.payload];

    default:
      return state;
  }
};
