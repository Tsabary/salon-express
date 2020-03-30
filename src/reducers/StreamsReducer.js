import {
  FETCH_NEW_STREAMS,
  FETCH_MORE_STREAMS,
  NEW_STREAM,
  DELETE_STREAM,
  EDIT_STREAM
} from "../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_NEW_STREAMS:
      return action.payload;

    case FETCH_MORE_STREAMS:
      return [...state, ...action.payload];

    case NEW_STREAM:
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
