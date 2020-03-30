import {
  FETCH_MY_STREAMS,
  ADD_MY_STREAMS,
  EDIT_MY_STREAMS,
  DELETE_MY_STREAMS
} from "../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_MY_STREAMS:
      return action.payload;

    case ADD_MY_STREAMS:
      return [...state, action.payload];

    case EDIT_MY_STREAMS:
      return state.map(stream =>
        stream.id === action.payload.id ? action.payload : stream
      );

    case DELETE_MY_STREAMS:
      return state.filter(post => post.id !== action.payload);

    default:
      return state;
  }
};
