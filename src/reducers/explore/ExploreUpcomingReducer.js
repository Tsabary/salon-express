import {
  FETCH_NEW_EXPLORE_UPCOMING,
  FETCH_MORE_EXPLORE_UPCOMING,
  DELETE_STREAM,
  EDIT_STREAM,
  NEW_STREAM_UPCOMING
} from "../../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_EXPLORE_UPCOMING:
      return action.payload;

    case FETCH_MORE_EXPLORE_UPCOMING:
      return [...state, ...action.payload];

    case NEW_STREAM_UPCOMING:
      return [...state, action.payload];

    case DELETE_STREAM:
      return state.filter(stream => stream.id !== action.payload);

    case EDIT_STREAM:
      return state.map(stream =>
        stream.id === action.payload.id ? action.payload : stream
      );

    default:
      return state;
  }
};
