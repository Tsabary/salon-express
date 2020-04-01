import {
  FETCH_NEW_SEARCHED_STREAMS,
  FETCH_MORE_SEARCHED_STREAMS,
  DELETE_STREAM,
  EDIT_STREAM
} from "../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_SEARCHED_STREAMS:
      return action.payload;

    case FETCH_MORE_SEARCHED_STREAMS:
      return [...state, ...action.payload];

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
